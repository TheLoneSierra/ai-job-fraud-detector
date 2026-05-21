const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsText(file);
  });
};

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const isImageFile = (file) => {
  return file.type?.startsWith("image/") || /\.(png|jpe?g|webp|bmp|gif|tiff?)$/i.test(file.name);
};

const apiUrl = (path) => {
  return API_BASE ? `${API_BASE}${path}` : path;
};

const parseApiResponse = async (response) => {
  const rawText = await response.text();

  try {
    return rawText ? JSON.parse(rawText) : {};
  } catch {
    return { message: rawText || "Unexpected response from server" };
  }
};

const cleanOcrText = (text) => {
  const normalized = String(text || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[|]{2,}/g, " ")
    .replace(/[~^`]+/g, " ");

  return normalized
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/\s+/g, " ")
        .replace(/^[^\w@:/('"$]+/, "")
        .replace(/[^\w.)\]@:/?!'"%$]+$/, "")
        .trim(),
    )
    .filter((line) => {
      if (line.length < 3) {
        return false;
      }

      const lettersAndNumbers = (line.match(/[a-z0-9]/gi) || []).length;
      const usefulWords = (line.match(/[a-z0-9@:/.-]{3,}/gi) || []).length;
      const usefulRatio = lettersAndNumbers / line.length;
      const looksLikeBrowserChrome =
        /\b(gmail|compose|inbox|snoozed|sent|labels|more|reply|forward|upgrade)\b/i.test(line) &&
        usefulWords <= 3;

      return usefulRatio >= 0.45 && usefulWords >= 1 && !looksLikeBrowserChrome;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const extractImageText = async (file) => {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    logger: () => {},
  });

  try {
    const { data } = await worker.recognize(file);
    return cleanOcrText(data?.text);
  } finally {
    await worker.terminate();
  }
};

export const extractDocumentText = async (file) => {
  if (!file || !(file instanceof File)) {
    return "";
  }

  if (
    file.type?.startsWith("text/") ||
    file.name.toLowerCase().endsWith(".json")
  ) {
    return readFileAsText(file);
  }

  if (isImageFile(file)) {
    return extractImageText(file);
  }

  if (API_BASE) {
    return "";
  }

  const formData = new FormData();
  formData.append("document", file);

  try {
    const response = await fetch(apiUrl("/api/analyze/extract"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return "";
    }

    const data = await parseApiResponse(response);
    return data?.data?.extractedText || "";
  } catch {
    return "";
  }
};

export const analyzeScamText = async ({ text = "", file } = {}) => {
  let response;
  let requestKind = "json";

  try {
    if (
      file &&
      file instanceof File &&
      file.type &&
      file.type.startsWith("text/")
    ) {
      requestKind = "json-textfile";
      const fileText = await readFileAsText(file);
      response = await fetch(apiUrl("/api/analyze"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text || fileText }),
      });
    } else if (file && file instanceof File) {
      requestKind = "multipart";
      const formData = new FormData();
      formData.append("document", file);

      if (text) {
        formData.append("text", text);
      }

      response = await fetch(apiUrl("/api/analyze"), {
        method: "POST",
        body: formData,
      });
    } else {
      requestKind = "json";
      response = await fetch(apiUrl("/api/analyze"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    }

    const data = await parseApiResponse(response);

    if (!response.ok) {
      console.error("/api/analyze failed", {
        status: response.status,
        requestKind,
        data,
      });
      throw new Error(data.message || "Failed to analyze scam text");
    }

    return data;
  } catch (err) {
    console.error("/api/analyze request error", {
      requestKind,
      err,
    });
    throw err;
  }
};
