import * as historyService from "../services/history.service.js";

export const getHistory = async (req, res, next) => {
  try {
    const historyList = await historyService.getUserHistory(req.user._id);
    return res.status(200).json({
      success: true,
      data: historyList,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "History entry ID is required.",
      });
    }

    const result = await historyService.deleteHistoryEntry(req.user._id, id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await historyService.clearUserHistory(req.user._id);
    return res.status(200).json({
      success: true,
      data: { message: "All history cleared successfully" },
    });
  } catch (error) {
    next(error);
  }
};
