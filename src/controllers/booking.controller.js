import express from "express";
import bookingModel from "../models/booking.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import generateUniqueBookingId from "../utils/bookingIdGeneration.js";
import { startOtpGeneration , endOtpGeneration} from "../utils/bookingOtpGeneration.js";

var createBooking = asyncHandler(async (req, res) => {
    var userId = req.user.userId;
    var {category , subcategory} = req.body;
    var bookingId = generateUniqueBookingId();
    var bookingDate = new Date();
    var status = "pending";
    console.log("category" , category);
    console.log("subcategory" , subcategory);
    console.log("userId" , userId);
    if(!userId) {
        return ApiResponse.error(res, 400 , "userId is required");
    }
    if(userId){

        var booking = await bookingModel.findOne({bookingId: bookingId});
        if(booking){
            return ApiResponse.error(res, 400 , "Booking already exists");
        }
        if(!booking){
            var newbooking = await bookingModel.create({
                userId: userId,
                bookingId: bookingId,
                bookingDate: bookingDate,
                status: status,
                category: category,
                subCategory: subcategory,
                startOtp: startOtpGeneration(),
                endOtp: endOtpGeneration(),
            })
            if(newbooking){
                return ApiResponse.success(res, "booking created successfully", newbooking);
            }
            if(!newbooking){
                return ApiResponse.error(res, 400 , "Booking not created");
            }
        }
    }
});

var getBooking = asyncHandler(async (req, res) => {
    var userId = req.user.userId;
    console.log("userId" , userId);
    if(!userId){
        return ApiResponse.error(res, 400 , "userId is required");
    }
    if(userId){
        var booking = await bookingModel.find({userId : userId});
        if(!booking){
            return ApiResponse.error(res , 404 , "Booking not found");
        }
        if(booking){
            return ApiResponse.success(res, "Booking fetched successfully", booking);
        }
    }
});

var validateStartOtp = asyncHandler(async (req, res) => {
    var userId = req.user.userId;
    var  {startOtp , bookingId} = req.body;
    console.log("bookingId" , bookingId);
    console.log("startOtp" , startOtp);
    if(!userId){
        return ApiResponse.error(res, 400 , "userId is required");
    }
    if(!bookingId){
        return ApiResponse.error(res, 400 , "bookingId is required");
    }
    if(!startOtp){
        return ApiResponse.error(res, 400 , "startOtp is required");
    }
    if(bookingId && startOtp){
        var booking = await bookingModel.findOne({bookingId: bookingId});
        if(!booking){
            return ApiResponse.error(res, 404 , "Booking not found");
        }
        if(booking.startOtp === startOtp){
            var updatedBooking = await bookingModel.findOneAndUpdate(
                {bookingId: bookingId},
                {status: "confirmed"},
                {new: true}
            );
            return ApiResponse.success(res, "Start OTP verified successfully", updatedBooking);
        } else {
            return ApiResponse.error(res, 400 , "Invalid Start OTP");
        }
    }
})

var validateEndOtp = asyncHandler(async (req, res) => {
    var userId = req.user.userId;
    var {bookingId , endOtp} = req.body;
    console.log("bookingId" , bookingId);
    console.log("endOtp" , endOtp);
    if(!userId){
        return ApiResponse.error(res, 400 , "userId is required");
    }
    if(!bookingId){
        return ApiResponse.error(res, 400 , "bookingId is required");
    }
    if(!endOtp){
        return ApiResponse.error(res, 400 , "endOtp is required");
    }
    if(bookingId && endOtp){
        var booking = await bookingModel.findOne({bookingId: bookingId});
        if(!booking){
            return ApiResponse.error(res, n404 , "Booking not found");
        }
        if(booking.endOtp === endOtp){
            var updatedBooking = await bookingModel.findOneAndUpdate(
                {bookingId: bookingId},
                {status: "completed"},
                {new: true}
            );
            return ApiResponse.success(res, "End OTP verified successfully", updatedBooking);
        } else {
            return ApiResponse.error(res, 400 , "Invalid End OTP");
        }
    }
})
export {createBooking , getBooking , validateStartOtp , validateEndOtp};