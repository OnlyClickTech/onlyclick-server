import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema({
    serviceId : {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    subCategory: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: null,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
});

const serviceModel = mongoose.model("services", serviceSchema);
export default serviceModel;