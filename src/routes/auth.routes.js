import express from "express";
import { sendOtp , verifyOtp } from "../controllers/auth.controller.js";

var router = express.Router();

router.post("/send-otp" , sendOtp);
router.post("/verify-otp" , verifyOtp);

export default router;