import userModel from "../models/users.model.js";
import createVerification from "../otp/otp-send.service.js";
import createVerificationCheck from "../otp/otp-verify.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import generateUniqueUserId from "../utils/userIdGeneration.js";
import jwt from "jsonwebtoken";

const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return ApiResponse.error(res, 400, {
      message: "Phone number is required",
    });
  }

  const response = await createVerification(phoneNumber);
  if (response) {
    return ApiResponse.success(res, {
      statusCode: 200,
      message: "OTP sent successfully",
    });
  }

  return ApiResponse.error(res, 400, {
    message: "Failed to send OTP",
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return ApiResponse.error(res, 400, {
      message: "Phone number and OTP are required",
    });
  }

  const response = await createVerificationCheck(phoneNumber, code);
  if (!response) {
    return ApiResponse.error(res, 400, {
      message: "Invalid or expired OTP",
    });
  }
  console.log("OTP verification response:", response);
  if(response.status !== "approved") {
    return ApiResponse.error(res, 400, {
      message: "OTP verification failed",
    });
  }

  let user = await userModel.findOne({ phoneNumber });

  if (!user) {
    user = await userModel.create({
      phoneNumber,
      userId: generateUniqueUserId(),
    });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  const formatDate = (ts) =>
    new Date(ts * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  return ApiResponse.success(res, "Logged in successfully", {
    accessToken,
    refreshToken,
    user,
    accessTokenExpiry : formatDate(jwt.decode(accessToken).exp),
    refreshTokenExpiry : formatDate(jwt.decode(refreshToken).exp)
  });
});

export { sendOtp, verifyOtp };