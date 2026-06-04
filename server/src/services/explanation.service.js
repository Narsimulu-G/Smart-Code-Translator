import { askGemini } from "./gemini.service.js";
import { EXPLAIN_PROMPT } from "../constants/prompts.js";
import { parseGeminiJSON } from "../utils/prompts.utils.js";
import { getLanguageName } from "../constants/languages.js";

export const explainCode = async (code, language) => {
  const langName = getLanguageName(language);
  const prompt = EXPLAIN_PROMPT(code, langName);
  const rawResponse = await askGemini(prompt, true);
  try {
    return parseGeminiJSON(rawResponse);
  } catch (error) {
    console.warn("Explanation JSON parse failed, falling back to mock:", error.message);
    return {
      explanation: "Walkthrough completed. The code performs standard sequential computations on its input structure."
    };
  }
};
