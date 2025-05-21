import userModel from "../models/users.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const updateUser = asyncHandler(async (req, res) => {
    const { name, phoneNumber  , email} = req.body;
    const userId = req.user.userId; // coming from your middleware

    if (!name && !phoneNumber) {
        return ApiResponse.error(res, 400, {
            message: "Name and phone number are required"
        });
    }

    var updateData = {};
    if (name) {
        updateData.name = name;
    }
    if (phoneNumber) {
        updateData.phoneNumber = phoneNumber;
    }
    if(email){
        updateData.email = email;
    }

    const user = await userModel.findOneAndUpdate(
        { userId },
        updateData,
        { new: true }
    );

    if (!user) {
        return ApiResponse.error(res, 404, {
            message: "User not found"
        });
    }

    return ApiResponse.success(res, 200, {
        message: "User updated successfully",
        user
    });
});

export var updateUserAddress = asyncHandler(async (req, res) => {
    var { address1 , address2 , address3} = req.body;
    var userId = req.user.userId; // coming from your middleware
    if (!address1 && !address2 && !address3) {
        return ApiResponse.error(res, 400, {
            message: "Address is required"
        });
    }
    var updateData = {};
    if (address1) {
        updateData.address1 = address1;
    }
    if (address2) {
        updateData.address2 = address2;
    }
    if (address3) {
        updateData.address3 = address3;
    }
    console.log(updateData);
    const user = await userModel.findOneAndUpdate(
        { userId },
        { $set: { address: updateData } },
        { new: true }
    );
    if (!user) {
        return ApiResponse.error(res, 404, {
            message: "User not found"
        });
    }
    if(user){
        return ApiResponse.success(res, 200, {
            message: "User address updated successfully",
            user
        });
    }
    return ApiResponse.error(res, 404, {
        message: "User not found"
    });
});
export var getUser = asyncHandler(async (req, res) => {

    var userId = req.user.userId; // coming from your middleware
    console.log(userId);
    if (!userId) {
        return ApiResponse.error(res, 400, {
            message: "User ID is required"
        });
    }
    const user = await userModel.findOne({ userId });
    if (!user) {
        return ApiResponse.error(res, 404, {
            message: "User not found"
        });
    }
    return ApiResponse.success(res, 200, {
        message: "User fetched successfully",
        user
    });
});