const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsText(file);
  });
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
      response = await fetch("/api/analyze", {
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

      response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
    } else {
      requestKind = "json";
      response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    }

    const rawText = await response.text();
    let data;

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { message: rawText || "Unexpected response from server" };
    }

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
