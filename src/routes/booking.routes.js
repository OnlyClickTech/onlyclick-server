import express from 'express';
import bookingModel from '../models/booking.model.js';
import {createBooking , getBooking, validateEndOtp, validateStartOtp } from '../controllers/booking.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

var router = express.Router();

router.post("/create-booking" , authenticateUser , createBooking);
router.get("/get-booking" , authenticateUser , getBooking);
router.put("/validate-startotp" , authenticateUser , validateStartOtp);
router.put("/validate-endotp" , authenticateUser , validateEndOtp);

export default router;