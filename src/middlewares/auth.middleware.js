import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/ApiError.js";
import userModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError("Authorization token missing", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Use correct secret
    const decoded = jwt.verify(token, "20eaebbeece4c169834168320bb76939fc56021874a1c7f8e3cd23a125f4e87d826a7aeeda635f0e861336555acdd1388c72e7625969abb4e73815e00d62f6e8");
    const userId = decoded?.userId;

    if (!userId) {
      return next(new ApiError("Invalid token payload", 401));
    }

    const user = await userModel.findOne({ userId });

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 401, error);
  }
});

export default authenticateUser;
