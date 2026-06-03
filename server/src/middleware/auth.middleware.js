import { verifyToken } from "../utils/jwt.utils.js";
import User from "../models/User.model.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this route.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this route.",
      });
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or authorization expired.",
        });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is invalid or expired.",
      });
    }
  } catch (error) {
    next(error);
  }
};

export default authenticate;
