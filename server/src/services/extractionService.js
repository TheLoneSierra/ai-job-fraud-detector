import fs from "fs/promises";
import { createWorker } from "tesseract.js";

const isImage = (mimetype, filename) =>
  mimetype?.startsWith("image/") ||
  /\.(png|jpe?g|bmp|gif|tiff?)$/i.test(filename);

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
        /\b(gmail|compose|inbox|snoozed|sent|labels|more|reply|forward|upgrade)\b/i.test(
          line,
        ) && usefulWords <= 3;

      return usefulRatio >= 0.45 && usefulWords >= 1 && !looksLikeBrowserChrome;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const extractTextFromFile = async (filePath, mimetype, filename) => {
  if (!filePath) {
    return "";
  }

  if (isImage(mimetype, filename)) {
    const fileBuffer = await fs.readFile(filePath);
    const worker = await createWorker("eng", 1, {
      logger: () => {},
    });

    try {
      const { data } = await worker.recognize(fileBuffer);
      return cleanOcrText(data?.text);
    } catch (ocrError) {
      console.warn("Image OCR failed", filename, ocrError?.message || ocrError);
      return "";
    } finally {
      await worker.terminate();
    }
  }

  // Fallback for unknown file types
  try {
    return (await fs.readFile(filePath, "utf-8")).trim();
  } catch {
    return "";
  }
};
