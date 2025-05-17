import mongoose from "mongoose";
import { roles } from "../utils/constants.js";
import addressSchema from "./address.model.js";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default : null,
    },
    userId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    roles: {
      type: String,
      default: "user",
    },
    address: {
      type: [addressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    userId: this.userId
  },
  "20eaebbeece4c169834168320bb76939fc56021874a1c7f8e3cd23a125f4e87d826a7aeeda635f0e861336555acdd1388c72e7625969abb4e73815e00d62f6e8",
  {
    expiresIn: "1h"
  },
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    userId: this.userId
  },
  "41aeb4a282a205e83b0a2c6bd5fcd679e998026e4a24e51c6a4c13c338619c3ea2888a0bceaed4f5f4b52895a75f372b3fc3e6b3c8b1fe81971b0261e6f9da05",
  {
    expiresIn: "10d"
  },
  )
}


const userModel = mongoose.model("users", userSchema);
export default userModel;