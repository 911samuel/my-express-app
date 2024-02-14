"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var brandSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    destination: { type: String },
    email: { type: String, required: true },
    phoneNumber: { type: Number },
    age: { type: Number },
    description: { type: String }
}, { timestamps: true });
var Brand = mongoose_1.default.model('Brand', brandSchema);
exports.default = Brand;
