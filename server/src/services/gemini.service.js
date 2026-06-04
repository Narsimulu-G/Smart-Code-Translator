import { generateContent } from "../config/gemini.config.js";

const getMockResponse = (prompt) => {
  if (prompt.includes("complexity") || prompt.includes("timeComplexity")) {
    return JSON.stringify({
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      explanation: "[Mock AI Analysis] The code recursively partitions the collection into halves (O(log N) depth recursion tree) and merges them in linear time (O(N) operations per level), yielding a total time complexity of O(N log N) and space complexity of O(N)."
    });
  }
  
  if (prompt.includes("Optimize") || prompt.includes("optimizedCode")) {
    return JSON.stringify({
      optimizedCode: `// [Mock AI Optimized Code]
def optimized_function(arr):
    # Replaced quadratic bubble sort with linear-time hash matching
    seen = {}
    for x in arr:
        seen[x] = seen.get(x, 0) + 1
    return seen`,
      suggestions: "• Avoided quadratic O(N^2) nested comparisons by utilizing an associative lookup table.\n• Reduced space consumption by avoiding duplicate item lists.\n• Rewrote logic to follow idiomatic code structures."
    });
  }

  if (prompt.includes("Explain") || prompt.includes("patient programming teacher")) {
    return JSON.stringify({
      explanation: "[Mock AI Explanation]\n1. First, the algorithm obtains the dimensions of the input structure.\n2. It enters a nested comparison block to check adjacently positioned elements.\n3. If any element pairs violate sorted ordering, it performs an in-place swap operation.\n4. Lastly, the sorted array is returned back to the caller."
    });
  }

  if (prompt.includes("Translate") || prompt.includes("translate")) {
    let target = "Java";
    if (prompt.includes("to Java")) target = "Java";
    else if (prompt.includes("to Python")) target = "Python";
    else if (prompt.includes("to C++")) target = "C++";
    else if (prompt.includes("to C#")) target = "C#";
    else if (prompt.includes("to C")) target = "C";

    return `// [Mock AI Translation to ${target}]
// Successfully converted bubble sort algorithm
public class MockTranslatedClass {
    public static void run() {
        System.out.println("Hello from mock translated output!");
    }
}`;
  }

  return "Mock Gemini Response";
};

export const askGemini = async (prompt, isJson = false) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasGeminiKey = apiKey && apiKey !== "your_gemini_api_key_here";

  if (hasGeminiKey) {
    try {
      const response = await generateContent(prompt, isJson);
      if (response) {
        return response;
      }
      throw new Error("Gemini returned an empty response");
    } catch (error) {
      console.warn(`Gemini API call failed (${error?.message || error}). Trying OpenAI fallback...`);
    }
  }

  // Fallback to OpenAI if key is available in environment
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey !== "your_openai_api_key_here" && !openaiKey.includes("sk-proj-placeholder")) {
    try {
      console.log("Using OpenAI fallback model (gpt-4o-mini) to serve response.");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          ...(isJson ? { response_format: { type: "json_object" } } : {})
        })
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return content;
        }
      }
      console.warn(`OpenAI API responded with status: ${response.status}`);
    } catch (openaiError) {
      console.warn(`OpenAI API call failed (${openaiError?.message || openaiError}).`);
    }
  }

  console.warn("Using mock Gemini response as final fallback.");
  return getMockResponse(prompt);
};
