import express from 'express';
import serviceModel from '../models/service.model.js';
import {createService , getService, updateService, deleteService,   addReview,
    getReviews} from '../controllers/service.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

var router = express.Router();

router.post("/create-service" , createService);
router.get("/get-service" , getService);
router.put("/update-service" , updateService);
router.delete("/delete-service" , deleteService);

router.post("/add-review", addReview);
router.get("/:serviceId/reviews", getReviews);

export default router;