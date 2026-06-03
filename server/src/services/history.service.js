import History from "../models/History.model.js";

export const createHistoryEntry = async (
  userId,
  operationType,
  inputCode,
  inputLanguage,
  targetLanguage,
  output
) => {
  return await History.create({
    userId,
    operationType,
    inputCode,
    inputLanguage,
    targetLanguage,
    output,
  });
};

export const getUserHistory = async (userId) => {
  return await History.find({ userId }).sort({ createdAt: -1 });
};

export const deleteHistoryEntry = async (userId, entryId) => {
  const result = await History.findOneAndDelete({ _id: entryId, userId });
  if (!result) {
    const error = new Error("History entry not found");
    error.statusCode = 404;
    throw error;
  }
  return result;
};

export const clearUserHistory = async (userId) => {
  return await History.deleteMany({ userId });
};
