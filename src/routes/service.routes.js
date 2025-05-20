import express from 'express';
import serviceModel from '../models/service.model.js';
import {createService , getService, updateService, deleteService} from '../controllers/service.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

var router = express.Router();

router.post("/create-service" , authenticateUser , createService);
router.get("/get-service" , authenticateUser , getService);
router.put("/update-service" , authenticateUser , updateService);
router.delete("/delete-service" , authenticateUser , deleteService);
export default router;