import userModel from '../models/users.model.js';
import createVerification from '../otp/otp-send.service.js';
import createVerificationCheck from '../otp/otp-verify.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import generateUniqueUserId from '../utils/userIdGeneration.js';
import { UserBindingPage } from 'twilio/lib/rest/ipMessaging/v2/service/user/userBinding.js';

const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return ApiResponse.error(res, 400, {
      message: 'Phone number is required',
    });
  }

  const response = await createVerification(phoneNumber);
  console.log(response);
  if (response) {
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'OTP sent successfully',
    });
  }
  if(!response) {
    return ApiResponse.error(res, 400, {
      message: 'Failed to send OTP',
    });
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return ApiResponse.error(res, 400, {
      message: 'Phone number and OTP are required',
    });
  }

  const response = await createVerificationCheck(phoneNumber, code);
  console.log(response);
  if (!response) {
    return ApiResponse.error(res, 400, {
      message: 'Invalid or expired OTP',
    });
  }
  if (response) {
    var user = await userModel.findOne({ phoneNumber });
    var accessToken = user.generateAccessToken();
    var refreshToken = user.generateRefreshToken();
    if (!user) {
      user = await userModel.create({ phoneNumber : phoneNumber  , userId : generateUniqueUserId() });
      return ApiResponse.success(res , "logged in and user created" , {
        accessToken,
        refreshToken,
        user
      })
    }

    if(user){
        return ApiResponse.success(res , "logged in with existing user" , {
          accessToken,
          refreshToken,
          user
        })
    }
  }
  if(!response) {
    return ApiResponse.error(res, 400, {
      message: 'Failed to verify OTP',
    });
  }
});

export { sendOtp, verifyOtp };