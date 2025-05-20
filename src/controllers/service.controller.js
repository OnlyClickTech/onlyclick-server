import express from 'express';
import serviceModel from '../models/service.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

var createService = asyncHandler(async (req, res) => {
    var { category, subCategory, description, price, duration } = req.body;
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
    var { category, subCategory, description, price, duration } = req.body;
    var serviceId = req.params.id;
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

    var service = await serviceModel.findById(serviceId);
    if (!service) {
        return ApiResponse.error(res, 404, "Service not found");
    }
    if (service) {
        var updatedService = await serviceModel.findByIdAndUpdate(serviceId,
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
    var serviceId = req.params.id;
    console.log("serviceId", serviceId);
    if (!serviceId) {
        return ApiResponse.error(res, 400, "serviceId is required");
    }
    if (serviceId) {
        var service = await serviceModel.findById(serviceId);
        if (!service) {
            return ApiResponse.error(res, 404, "Service not found");
        }
        if (service) {
            var deletedService = await serviceModel.findByIdAndDelete(serviceId);
            if (deletedService) {
                return ApiResponse.success(res, "Service deleted successfully", deletedService);
            }
            if (!deletedService) {
                return ApiResponse.error(res, 400, "Service not deleted");
            }
        }
    }
})

export { createService, getService, updateService, deleteService };