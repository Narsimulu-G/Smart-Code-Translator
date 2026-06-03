export const parseGeminiJSON = (text) => {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, "");
      cleanText = cleanText.replace(/\n?```\s*$/, "");
    }
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("parseGeminiJSON Error parsing:", text);
    throw new Error("Failed to parse response from AI model as JSON: " + error.message);
  }
};

export const cleanCodeResponse = (text) => {
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```\w*\s*\n?/, "");
    cleanText = cleanText.replace(/\n?```\s*$/, "");
  }
  return cleanText.trim();
};
