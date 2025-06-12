import express from "express";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import reviewModel from "../models/review.model.js";

// Create review
const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const userId = req.user.userId;

  if (!userId || !bookingId || !rating || !comment) {
    return ApiResponse.error(res, 400, "All fields are required");
  }

  // Check if review already exists
  const existingReview = await reviewModel.findOne({ userId, bookingId });
  if (existingReview) {
    return ApiResponse.error(res, 400, "Review already exists for this booking");
  }

  const newReview = await reviewModel.create({
    userId,
    bookingId,
    rating,
    comment
  });

  return ApiResponse.success(res, "Review created successfully", newReview);
});

// Get user reviews
const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return ApiResponse.error(res, 400, "User ID is required");
  }

  const reviews = await reviewModel.find({ userId });

  return ApiResponse.success(res, "Reviews fetched successfully", reviews);
});

// Get all reviews
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewModel.find();

  return ApiResponse.success(res, "All reviews fetched successfully", reviews);
});

// Update review
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId, rating, comment } = req.body;
  const userId = req.user.userId;

  if (!reviewId || !rating || !comment) {
    return ApiResponse.error(res, 400, "All fields are required");
  }

  const review = await reviewModel.findOne({ _id: reviewId, userId });

  if (!review) {
    return ApiResponse.error(res, 404, "Review not found or not yours");
  }

  review.rating = rating;
  review.comment = comment;
  await review.save();

  return ApiResponse.success(res, "Review updated successfully", review);
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.body;
  const userId = req.user.userId;

  if (!reviewId) {
    return ApiResponse.error(res, 400, "reviewId is required");
  }

  const review = await reviewModel.findOneAndDelete({ _id: reviewId, userId });

  if (!review) {
    return ApiResponse.error(res, 404, "Review not found or not yours");
  }

  return ApiResponse.success(res, "Review deleted successfully");
});

export {createReview , getUserReviews, getAllReviews, updateReview, deleteReview};