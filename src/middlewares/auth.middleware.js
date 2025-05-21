import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import userModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.error(res, 401, {
      message: "Authorization header is missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    // Try access token
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // If access token fails, try refresh token
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      } catch (refreshError) {
        return ApiResponse.error(res, 401, {
          message: "Invalid or expired token",
        });
      }
    } else {
      return ApiResponse.error(res, 401, {
        message: "Token verification failed",
      });
    }
  }

  const userId = decoded?.userId;

  if (!userId) {
    return ApiResponse.error(res, 401, {
      message: "Invalid token payload",
    });
  }

  const user = await userModel.findOne({ userId });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  req.user = user;
  next();
});

export default authenticateUser;
