import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import toast from "react-hot-toast";
import {
  translateCode,
  analyzeComplexity,
  optimizeCode,
  explainCode,
} from "../services/codeService.js";
import { SUPPORTED_LANGUAGES, getLanguageExtension } from "../constants/languages.js";
import "../styles/editor.css";

const DEFAULT_SNIPPETS = {
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
  java: `public class Main {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
  cpp: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
  c: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
  csharp: `using System;

public class Program {
    public static void BubbleSort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`
};

function HomePage() {
  const [sourceLang, setSourceLang] = useState("python");
  const [targetLang, setTargetLang] = useState("java");
  const [mode, setMode] = useState("translate");
  
  const [inputCode, setInputCode] = useState(DEFAULT_SNIPPETS.python);
  const [loading, setLoading] = useState(false);

  const [translatedCode, setTranslatedCode] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [explanationResult, setExplanationResult] = useState(null);

  useEffect(() => {
    const defaultSnippetsList = Object.values(DEFAULT_SNIPPETS);
    if (!inputCode || defaultSnippetsList.includes(inputCode)) {
      setInputCode(DEFAULT_SNIPPETS[sourceLang] || "");
    }
  }, [sourceLang]);

  const handleRun = async () => {
    if (!inputCode.trim()) {
      return toast.error("Please enter some code to process.");
    }
    
    setLoading(true);
    if (mode === "translate") setTranslatedCode("");
    else if (mode === "analyze") setAnalysisResult(null);
    else if (mode === "optimize") setOptimizationResult(null);
    else if (mode === "explain") setExplanationResult(null);

    try {
      if (mode === "translate") {
        if (sourceLang === targetLang) {
          toast.error("Source language and Target language cannot be the same.");
          setLoading(false);
          return;
        }
        const res = await translateCode(inputCode, sourceLang, targetLang);
        setTranslatedCode(res.translatedCode);
        toast.success("Translation completed!");
      } else if (mode === "analyze") {
        const res = await analyzeComplexity(inputCode, sourceLang);
        setAnalysisResult(res);
        toast.success("Complexity analysis completed!");
      } else if (mode === "optimize") {
        const res = await optimizeCode(inputCode, sourceLang);
        setOptimizationResult(res);
        toast.success("Optimization completed!");
      } else if (mode === "explain") {
        const res = await explainCode(inputCode, sourceLang);
        setExplanationResult(res);
        toast.success("Explanation completed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    
    if (translatedCode) {
      setInputCode(translatedCode);
      setTranslatedCode("");
    }
  };

  return (
    <div className="home-container main-content">
      <div className="mode-tabs-container">
        <div className="mode-tabs">
          <button
            className={`tab-btn ${mode === "translate" ? "active" : ""}`}
            onClick={() => setMode("translate")}
          >
            Translate Code
          </button>
          <button
            className={`tab-btn ${mode === "analyze" ? "active" : ""}`}
            onClick={() => setMode("analyze")}
          >
            Analyze Complexity
          </button>
          <button
            className={`tab-btn ${mode === "optimize" ? "active" : ""}`}
            onClick={() => setMode("optimize")}
          >
            Optimize Code
          </button>
          <button
            className={`tab-btn ${mode === "explain" ? "active" : ""}`}
            onClick={() => setMode("explain")}
          >
            Explain Code
          </button>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Operation"}
        </button>
      </div>

      <div className="workspace-grid">
        {/* Input Panel */}
        <div className="editor-panel glass-card">
          <div className="panel-header">
            <span className="panel-title">Source Code Editor</span>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="lang-select"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="editor-wrapper">
            <MonacoEditor
              height="100%"
              theme="vs-dark"
              language={getLanguageExtension(sourceLang)}
              value={inputCode}
              onChange={(val) => setInputCode(val || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollbar: { vertical: "visible", horizontal: "visible" },
                padding: { top: 10, bottom: 10 },
                lineNumbersMinChars: 3,
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="editor-panel glass-card">
          {mode === "translate" ? (
            <>
              <div className="panel-header">
                <span className="panel-title">Translated Code</span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button onClick={swapLanguages} className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", borderRadius: "6px" }}>
                    Swap ⇄
                  </button>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="lang-select"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="editor-wrapper">
                {translatedCode ? (
                  <MonacoEditor
                    height="100%"
                    theme="vs-dark"
                    language={getLanguageExtension(targetLang)}
                    value={translatedCode}
                    options={{
                      readOnly: true,
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollbar: { vertical: "visible", horizontal: "visible" },
                      padding: { top: 10, bottom: 10 },
                      lineNumbersMinChars: 3,
                      wordWrap: "on",
                    }}
                  />
                ) : (
                  <div className="output-placeholder">
                    <span className="output-placeholder-icon">⇄</span>
                    <p>Click "Run Operation" to view code translation here.</p>
                  </div>
                )}
              </div>
            </>
          ) : mode === "analyze" ? (
            <>
              <div className="panel-header">
                <span className="panel-title">Complexity Profile</span>
              </div>
              <div className="editor-wrapper">
                {analysisResult ? (
                  <div className="analysis-output">
                    <div className="complexity-card-grid">
                      <div className="complexity-card">
                        <div className="complexity-label">Time Complexity</div>
                        <div className="complexity-value">{analysisResult.timeComplexity}</div>
                      </div>
                      <div className="complexity-card">
                        <div className="complexity-label">Space Complexity</div>
                        <div className="complexity-value">{analysisResult.spaceComplexity}</div>
                      </div>
                    </div>
                    <div className="analysis-details-header">Breakdown</div>
                    <div className="analysis-details-content">{analysisResult.explanation}</div>
                  </div>
                ) : (
                  <div className="output-placeholder">
                    <span className="output-placeholder-icon">⏱</span>
                    <p>Click "Run Operation" to view complexity analysis here.</p>
                  </div>
                )}
              </div>
            </>
          ) : mode === "optimize" ? (
            <>
              <div className="panel-header">
                <span className="panel-title">Optimized Version</span>
              </div>
              <div className="editor-wrapper" style={{ display: "flex", flexDirection: "column" }}>
                {optimizationResult ? (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ flex: 1, borderBottom: "1px solid var(--border)", position: "relative", minHeight: "250px" }}>
                      <MonacoEditor
                        height="100%"
                        theme="vs-dark"
                        language={getLanguageExtension(sourceLang)}
                        value={optimizationResult.optimizedCode}
                        options={{
                          readOnly: true,
                          fontSize: 14,
                          minimap: { enabled: false },
                          scrollbar: { vertical: "visible", horizontal: "visible" },
                          wordWrap: "on",
                        }}
                      />
                    </div>
                    <div className="optimize-output" style={{ flex: 0.8, minHeight: "180px", overflowY: "auto" }}>
                      <div className="suggestions-header">Refactoring Details</div>
                      <ul className="suggestions-list">
                        {optimizationResult.suggestions?.split("\n").filter(Boolean).map((sug, i) => (
                          <li key={i}>{sug.replace(/^[•\-\*]\s*/, "")}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="output-placeholder">
                    <span className="output-placeholder-icon">⚡</span>
                    <p>Click "Run Operation" to view optimized code suggestions here.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="panel-header">
                <span className="panel-title">Explanation Walkthrough</span>
              </div>
              <div className="editor-wrapper">
                {explanationResult ? (
                  <div className="explain-output">
                    <div className="analysis-details-header">AI Instructor Walkthrough</div>
                    <div className="analysis-details-content" style={{ lineHeight: "1.7" }}>{explanationResult.explanation}</div>
                  </div>
                ) : (
                  <div className="output-placeholder">
                    <span className="output-placeholder-icon">📖</span>
                    <p>Click "Run Operation" to view code explanation here.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
