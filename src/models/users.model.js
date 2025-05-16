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
    userId: this.userId,
    roles: this.roles,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: 86400
  },
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    userId: this.userId,
    roles: this.roles,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: 864000
  },
  )
}


const userModel = mongoose.model("users", userSchema);
export default userModel;