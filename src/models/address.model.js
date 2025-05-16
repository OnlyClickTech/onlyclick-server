import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    address1: {
      type: String,
      trim: true,
      required: true,
    },
    address2: {
      type: String,
      trim: true,
      default: null,
    },
    address3: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false, timestamps: true }
);

export default addressSchema;