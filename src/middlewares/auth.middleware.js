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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded?.userId; // <- this is your custom userId field

        if (!userId) {
            return next(new ApiError("Invalid token payload", 401));
        }

        // 🔍 Find user by custom `userId` field in the schema
        const user = await userModel.findOne({ userId });
        if (!user) {
            return next(new ApiError("User not found", 404));
        }

        req.user = user;
        next();
    } catch (error) {
        return ApiResponse.error(res, 401, "Invalid or expired token");
    }
});

export default authenticateUser;