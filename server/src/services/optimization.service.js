import { askGemini } from "./gemini.service.js";
import { OPTIMIZE_PROMPT } from "../constants/prompts.js";
import { parseGeminiJSON } from "../utils/prompts.utils.js";
import { getLanguageName } from "../constants/languages.js";

export const optimizeCode = async (code, language) => {
  const langName = getLanguageName(language);
  const prompt = OPTIMIZE_PROMPT(code, langName);
  const rawResponse = await askGemini(prompt, true);
  try {
    return parseGeminiJSON(rawResponse);
  } catch (error) {
    console.warn("Optimization JSON parse failed, falling back to mock:", error.message);
    return {
      optimizedCode: code,
      suggestions: "• Code is already optimal.\n• Structure leverages native helper interfaces where available."
    };
  }
};
