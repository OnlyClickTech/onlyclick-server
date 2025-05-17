import express from "express";
import {updateUser , getUser, updateUserAddress} from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

var router = express.Router();

router.put("/update-user", updateUser);
router.put("/update-user-address", authenticateUser , updateUserAddress);
router.get("/get-user" , authenticateUser ,  getUser);

export default router;