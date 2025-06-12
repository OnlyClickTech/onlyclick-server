import express from "express";
import mongoose from "mongoose";

var reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    bookingId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

var reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel;