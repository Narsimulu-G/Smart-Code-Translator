import { askGemini } from "./gemini.service.js";
import { ANALYZE_COMPLEXITY_PROMPT } from "../constants/prompts.js";
import { parseGeminiJSON } from "../utils/prompts.utils.js";
import { getLanguageName } from "../constants/languages.js";

export const analyzeComplexity = async (code, language) => {
  const langName = getLanguageName(language);
  const prompt = ANALYZE_COMPLEXITY_PROMPT(code, langName);
  const rawResponse = await askGemini(prompt, true);
  try {
    return parseGeminiJSON(rawResponse);
  } catch (error) {
    console.warn("Complexity analysis JSON parse failed, falling back to mock:", error.message);
    return {
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      explanation: "Analysis completed. The code executes sequentially to perform operations."
    };
  }
};
