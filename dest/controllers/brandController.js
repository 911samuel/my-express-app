"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.deleteBrand = exports.update = exports.store = exports.show = exports.index = void 0;
const brand_1 = __importDefault(require("../models/brand"));
const express_validator_1 = require("express-validator");
const index = async (req, res, next) => {
    try {
        const brands = await brand_1.default.find();
        res.json({ brands });
    }
    catch (error) {
        console.error("Error fetching brands:", error);
        res.status(500).json({ error: "An error occurred while fetching brands", details: error });
    }
};
exports.index = index;
const show = async (req, res, next) => {
    const id = req.params.id;
    try {
        const brand = await brand_1.default.findById(id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.json({ brand });
    }
    catch (error) {
        console.error("Error fetching brand:", error);
        next(error);
    }
};
exports.show = show;
const store = async (req, res, next) => {
    var _a;
    const { title, author, category, description } = req.body;
    const errors = (0, express_validator_1.validationResult)(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const brand = new brand_1.default({
            title,
            author,
            category,
            description,
            avatar: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
        });
        const savedBrand = await brand.save();
        res
            .status(201)
            .json({ message: "The brand was added successfully" });
    }
    catch (error) {
        console.error("Error saving brand:", error);
        res.status(500).json({ error: "Error on save the brand" });
    }
};
exports.store = store;
const update = async (req, res, next) => {
    const { title, author, category, description } = req.body;
    const brandId = req.params.id;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedBrand = await brand_1.default.findByIdAndUpdate(brandId, { $set: { title, author, category, description } }, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found." });
        }
        res
            .status(200)
            .json({
            message: `The brand was updated successfully.`,
            brand: updatedBrand,
        });
    }
    catch (error) {
        console.error("Error updating brand:", error);
        next(error);
    }
};
exports.update = update;
const deleteBrand = async (req, res, next) => {
    const brandId = req.params.id;
    try {
        const deletedBrand = await brand_1.default.findByIdAndDelete(brandId);
        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found." });
        }
        res.status(200).json({ message: `The brand was deleted successfully.` });
    }
    catch (error) {
        console.error("Error deleting brand:", error);
        next(error);
    }
};
exports.deleteBrand = deleteBrand;
const deleteAll = async (req, res, next) => {
    try {
        await brand_1.default.deleteMany({});
        res.status(200).json({ message: `All brands were deleted successfully.` });
    }
    catch (error) {
        console.error("Error deleting all brands:", error);
        next(error);
    }
};
exports.deleteAll = deleteAll;
