import express from "express";
import mongoose from "mongoose";
import { category , subCategory} from "../utils/constants.js";
const validSubCategories = Object.keys(subCategory);
var bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    bookingId: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    startOtp : {
        type: String,
        required: true,
        default: null,
    },
    endOtp : {
        type: String,
        required: true,
        default: null,
    },
    category : {
        type: String,
        required: true,
        enum : category,
        default: null,
    },
    subCategory : {
        type: String,
        required: true,
        default: null,
    },
    price : {
        type: Number,
        required: true,
        default: null,
    },
    taskmasterId : {
        type: String,
        required: true,
        default: null,
    },
    payment: {
        status: {
          type: String,
          enum: ['pending', 'completed', 'failed'],
          default: 'pending'
        },
        amount: Number
      }
      
});

var bookingModel = mongoose.model("Booking" , bookingSchema);
export default bookingModel;