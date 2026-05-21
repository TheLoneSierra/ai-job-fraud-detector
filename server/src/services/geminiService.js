// geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Model order: try default first, then fallbacks.
const defaultModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
// If 2.5 is rate-limited, try another Gemini model.
const fallbackModels = (
  process.env.GEMINI_FALLBACK_MODELS || "gemini-1.5-flash,gemini-1.0"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const getGenerativeModel = (modelName) =>
  genAI.getGenerativeModel({ model: modelName });

const fetchGeminiText = async (prompt, modelName) => {
  const model = getGenerativeModel(modelName);
  const result = await model.generateContent(prompt);
  return result?.response?.text ? await result.response.text() : String(result);
};

export const generateScamAnalysis = async (prompt) => {
  try {
    return await fetchGeminiText(prompt, defaultModel);
  } catch (error) {
    console.log("Gemini Error:", error);

    // Try multiple fallback models to avoid "too many requests".
    for (const candidateModel of fallbackModels) {
      if (!candidateModel || candidateModel === defaultModel) continue;

      try {
        console.log(
          `Retrying Gemini analysis with fallback model: ${candidateModel}`,
        );
        return await fetchGeminiText(prompt, candidateModel);
      } catch (fallbackError) {
        console.log(`Fallback model ${candidateModel} error:`, fallbackError);
      }
    }

    throw new Error(error?.message || "Gemini analysis failed");
  }
};
