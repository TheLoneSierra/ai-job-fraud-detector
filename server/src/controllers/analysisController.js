import fs from "fs/promises";
import scamPrompt from "../prompts/scamPrompt.js";
import { generateScamAnalysis } from "../services/geminiService.js";

export const analyzeText = async (req, res) => {
  try {
    const bodyText =
      typeof req.body?.text === "string" ? req.body.text.trim() : "";
    let promptInput = bodyText;

    if (req.file) {
      const fileInfo = `Uploaded document: ${req.file.originalname} (${req.file.mimetype}).`;
      const isTextFile =
        req.file.mimetype.startsWith("text/") ||
        req.file.originalname.toLowerCase().endsWith(".json");

      if (!promptInput && isTextFile) {
        promptInput = await fs.readFile(req.file.path, "utf-8");
      } else if (!promptInput) {
        promptInput = fileInfo;
      } else {
        promptInput += `

${fileInfo}`;
      }
    }

    if (!promptInput) {
      return res.status(400).json({
        success: false,
        message: "Text or document is required for scam analysis.",
      });
    }

    const prompt = scamPrompt(promptInput);
    const aiResponse = await generateScamAnalysis(prompt);

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
      source: req.file ? "Uploaded document" : "Text input",
    };

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
