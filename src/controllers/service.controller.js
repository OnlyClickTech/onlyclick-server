import express from 'express';
import serviceModel from '../models/service.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { calculateAverageRating } from '../utils/servicereview.js';

var createService = asyncHandler(async (req, res) => {
    var { serviceId , category, subCategory, description, price, duration } = req.body;
    console.log("category", category);
    console.log("subcategory", subCategory);
    console.log("description", description);
    console.log("price", price);
    console.log("duration", duration);

    if (!category) {
        return ApiResponse.error(res, 400, "category is required");
    }
    if (!subCategory) {
        return ApiResponse.error(res, 400, "subcategory is required");
    }
    if (!description) {
        return ApiResponse.error(res, 400, "description is required");
    }
    if (!price) {
        return ApiResponse.error(res, 400, "price is required");
    }
    if (!duration) {
        return ApiResponse.error(res, 400, "duration is required");
    }

    var existingService = await serviceModel.findOne({ 
        category: category,
        subCategory: subCategory 
    });
    if (existingService) {
        return ApiResponse.error(res, 400, "Service already exists");
    }
    if (!existingService) {
        var newService = await serviceModel.create({
            serviceId: serviceId,
            category: category,
            subCategory: subCategory,
            description: description,
            price: price,
            duration: duration,
        });
        if (newService) {
            return ApiResponse.success(res, "Service created successfully", newService);
        }
        if (!newService) {
            return ApiResponse.error(res, 400, "Service not created");
        }
    }
})

var getService = asyncHandler(async (req, res) => {
    var service = await serviceModel.find();
    if (!service) {
        return ApiResponse.error(res, 404, "Service not found");
    }
    if (service) {
        return ApiResponse.success(res, "Service fetched successfully", service);
    }
})

var updateService = asyncHandler(async (req, res) => {
    var { serviceId , category, subCategory, description, price, duration } = req.body;
    console.log("category", category);
    console.log("subcategory", subCategory);
    console.log("description", description);
    console.log("price", price);
    console.log("duration", duration);
    if (!serviceId) {
        return ApiResponse.error(res, 400, "serviceId is required");
    }
    if (!category) {
        return ApiResponse.error(res, 400, "category is required");
    }
    if (!subCategory) {
        return ApiResponse.error(res, 400, "subcategory is required");
    }
    if (!description) {
        return ApiResponse.error(res, 400, "description is required");
    }
    if (!price) {
        return ApiResponse.error(res, 400, "price is required");
    }
    if (!duration) {
        return ApiResponse.error(res, 400, "duration is required");
    }

    var service = await serviceModel.findOne({serviceId : serviceId});
    if (!service) {
        return ApiResponse.error(res, 404, "Service not found");
    }
    if (service) {
        var updatedService = await serviceModel.findOneAndUpdate({serviceId : serviceId},
            {
                category: category,
                subCategory: subCategory,
                description: description,
                price: price,
                duration: duration,
            },
            { new: true });
        if (updatedService) {
            return ApiResponse.success(res, "Service updated successfully", updatedService);
        }
        if (!updatedService) {
            return ApiResponse.error(res, 400, "Service not updated");
        }
    }
})

var deleteService = asyncHandler(async (req, res) => {
    var serviceId = req.body;
    console.log("serviceId", serviceId);
    if (!serviceId) {
        return ApiResponse.error(res, 400, "serviceId is required");
    }
    if (serviceId) {
        var service = await serviceModel.findOne(serviceId);
        if (!service) {
            return ApiResponse.error(res, 404, "Service not found");
        }
        if (service) {
            var deletedService = await serviceModel.findOneAndDelete(serviceId);
            if (deletedService) {
                return ApiResponse.success(res, "Service deleted successfully", deletedService);
            }
            if (!deletedService) {
                return ApiResponse.error(res, 400, "Service not deleted");
            }
        }
    }
})

const addReview = asyncHandler(async (req, res) => {
    const { serviceId, rating, comment } = req.body;

    // Validation
    if (!serviceId) throw new ApiError(400, "Service ID is required");
    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    const service = await serviceModel.findOne({ serviceId });
    if (!service) {
        throw new ApiError(404, "Service not found");
    }

    // Add the review
    service.reviews.push({ rating, comment });
    
    // Calculate new average rating
    service.averageRating = calculateAverageRating(service.reviews);
    
    const updatedService = await service.save();

    return ApiResponse.success(
        res, 
        "Review added successfully", 
        {
            reviews: updatedService.reviews,
            averageRating: updatedService.averageRating
        }
    );
});

const getReviews = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;

    if (!serviceId) {
        throw new ApiError(400, "Service ID is required");
    }

    const service = await serviceModel.findOne({ serviceId });
    if (!service) {
        throw new ApiError(404, "Service not found");
    }

    return ApiResponse.success(
        res, 
        "Reviews retrieved successfully", 
        {
            reviews: service.reviews,
            averageRating: service.averageRating
        }
    );
});


export { createService, getService, updateService, deleteService, addReview,
    getReviews};