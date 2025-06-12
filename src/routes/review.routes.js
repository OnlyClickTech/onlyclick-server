import express from "express";
import reviewModel from "../models/review.model.js";
import { createReview, getUserReviews, getAllReviews, updateReview } from "../controllers/review.controller.js";

var router = express.Router();
router.post("/create-review", createReview);
router.get("/get-user-reviews", getUserReviews);
router.get("/get-all-reviews", getAllReviews);
router.put("/update-review", updateReview);

export default router;