import * as translationService from "../services/translation.service.js";
import * as complexityService from "../services/complexity.service.js";
import * as optimizationService from "../services/optimization.service.js";
import * as explanationService from "../services/explanation.service.js";
import { createHistoryEntry } from "../services/history.service.js";

export const translate = async (req, res, next) => {
  try {
    const { code, sourceLanguage, targetLanguage } = req.body;
    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "Code, source language, and target language are required.",
      });
    }

    const translatedCode = await translationService.translateCode(
      code,
      sourceLanguage,
      targetLanguage
    );

    // Asynchronously log action to database
    createHistoryEntry(
      req.user._id,
      "translate",
      code,
      sourceLanguage,
      targetLanguage,
      { translatedCode }
    ).catch((err) => console.error("History saving error:", err));

    return res.status(200).json({
      success: true,
      data: { translatedCode },
    });
  } catch (error) {
    next(error);
  }
};

export const analyze = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required.",
      });
    }

    const result = await complexityService.analyzeComplexity(code, language);

    createHistoryEntry(
      req.user._id,
      "analyze",
      code,
      language,
      undefined,
      result
    ).catch((err) => console.error("History saving error:", err));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const optimize = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required.",
      });
    }

    const result = await optimizationService.optimizeCode(code, language);

    createHistoryEntry(
      req.user._id,
      "optimize",
      code,
      language,
      undefined,
      result
    ).catch((err) => console.error("History saving error:", err));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const explain = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required.",
      });
    }

    const result = await explanationService.explainCode(code, language);

    createHistoryEntry(
      req.user._id,
      "explain",
      code,
      language,
      undefined,
      result
    ).catch((err) => console.error("History saving error:", err));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
