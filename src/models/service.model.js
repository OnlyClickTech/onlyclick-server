import mongoose from "mongoose";
import { subCategory } from "../utils/constants";
const serviceSchema = new mongoose.Schema({
    category: {
    type: String,
    trim: true,
    required: true,
    },
    subCategory: {
    type: String,
    trim: true,
    required: true,
    },
    description: {
    type: String,
    trim: true,
    default: null,
    },
    price: {
    type: Number,
    required: true,
    },
    duration: {
    type: Number,
    required: true,
    },
});