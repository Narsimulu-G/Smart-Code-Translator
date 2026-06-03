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

export const askGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("Using mock Gemini response because GEMINI_API_KEY is not configured.");
    return getMockResponse(prompt);
  }

  try {
    const response = await generateContent(prompt);
    if (!response) {
      throw new Error("Gemini returned an empty response");
    }
    return response;
  } catch (error) {
    console.warn(`Gemini API call failed (${error.message}). Falling back to mock Gemini response.`);
    return getMockResponse(prompt);
  }
};
