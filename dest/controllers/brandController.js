"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.update = exports.store = exports.show = exports.index = void 0;
const brand_1 = __importDefault(require("../models/brand"));
const express_validator_1 = require("express-validator");
const index = async (req, res, next) => {
    try {
        const brands = await brand_1.default.find();
        res.json({ brands });
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred" });
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
        next(error);
    }
};
exports.show = show;
const store = async (req, res, next) => {
    const { title, author, category, description } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const brand = new brand_1.default({
            title,
            author,
            category,
            description,
        });
        const savedBrand = await brand.save();
        res
            .status(201)
            .json({ message: "The brand was added successfully" });
    }
    catch (error) {
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
        next(error);
    }
};
exports.deleteBrand = deleteBrand;
