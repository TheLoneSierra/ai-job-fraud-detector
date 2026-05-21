import fs from "fs/promises";
import scamPrompt from "../prompts/scamPrompt.js";
import { generateScamAnalysis } from "../services/geminiService.js";
import { extractTextFromFile } from "../services/extractionService.js";
import {
  findCompanyIntel,
  isStrongFreshCacheMatch,
  toCachedAnalysisPayload,
  toCacheMeta,
  upsertCompanyIntel,
} from "../services/companyIntelCacheService.js";

const getUploadedFileText = async (file) => {
  const isTextFile =
    file.mimetype.startsWith("text/") ||
    file.originalname.toLowerCase().endsWith(".json");

  if (isTextFile) {
    return fs.readFile(file.path, "utf-8");
  }

  return extractTextFromFile(file.path, file.mimetype, file.originalname);
};

export const extractDocumentText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document is required for text extraction.",
      });
    }

    const extractedText = (await getUploadedFileText(req.file)).trim();

    return res.status(200).json({
      success: true,
      data: {
        extractedText,
        sourceFile: req.file.originalname,
      },
    });
  } catch (error) {
    console.log("Extraction Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to extract document text.",
    });
  } finally {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.warn("Could not remove uploaded file:", cleanupError);
      }
    }
  }
};

export const searchCompanyIntel = async (req, res) => {
  try {
    const query = typeof req.query?.q === "string" ? req.query.q.trim() : "";

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Company, email, or domain query is required.",
      });
    }

    const cachedIntel = await findCompanyIntel(query);

    return res.status(200).json({
      success: true,
      data: cachedIntel ? toCacheMeta(cachedIntel, "hit") : { status: "miss" },
    });
  } catch (error) {
    console.log("Company Intel Search Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to search company intelligence.",
    });
  }
};

export const analyzeText = async (req, res) => {
  try {
    const bodyText =
      typeof req.body?.text === "string" ? req.body.text.trim() : "";
    let promptInput = bodyText;

    if (req.file) {
      const fileInfo = `Uploaded document: ${req.file.originalname} (${req.file.mimetype}).`;
      const fileText = await getUploadedFileText(req.file);

      if (!promptInput && fileText.trim()) {
        promptInput = fileText;
      } else if (!promptInput) {
        promptInput = fileInfo;
      } else if (fileText.trim()) {
        promptInput += `\n\n${fileText}`;
      } else {
        promptInput += `\n\n${fileInfo}`;
      }
    }

    if (!promptInput) {
      return res.status(400).json({
        success: false,
        message: "Text or document is required for scam analysis.",
      });
    }

    const cachedIntel = await findCompanyIntel(promptInput);

    if (isStrongFreshCacheMatch(cachedIntel, promptInput)) {
      const cachedPayload = toCachedAnalysisPayload(cachedIntel);

      return res.status(200).json({
        success: true,
        data: {
          ...cachedPayload,
          sourceFile: req.file?.originalname || "",
          extractedText: promptInput,
          source: "Cached company intelligence",
        },
      });
    }

    const prompt = scamPrompt(promptInput);
    let aiResponse;

    try {
      aiResponse = await generateScamAnalysis(prompt);
    } catch (aiError) {
      const cachedPayload = toCachedAnalysisPayload(cachedIntel);

      if (cachedPayload) {
        return res.status(200).json({
          success: true,
          data: {
            ...cachedPayload,
            sourceFile: req.file?.originalname || "",
            extractedText: promptInput,
            source: "Cached company intelligence",
          },
        });
      }

      throw aiError;
    }

    let parsedResponse;

    try {
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.log("JSON Parse Error:", parseError);

      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
        raw: aiResponse,
      });
    }

    const responsePayload = {
      ...parsedResponse,
      sourceFile: req.file?.originalname || "",
      extractedText: promptInput,
      cache: toCacheMeta(cachedIntel),
      source: req.file ? "Uploaded document" : "Text input",
    };

    const updatedIntel = await upsertCompanyIntel(promptInput, responsePayload);

    if (updatedIntel) {
      responsePayload.cache = toCacheMeta(
        updatedIntel,
        cachedIntel ? "updated-hit" : "saved",
      );
    }

    return res.status(200).json({
      success: true,
      data: responsePayload,
    });
  } catch (error) {
    console.log("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.warn("Could not remove uploaded file:", cleanupError);
      }
    }
  }
};
