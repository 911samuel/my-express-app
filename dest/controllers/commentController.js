"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const comment_1 = __importDefault(require("../models/comment"));
const brand_1 = __importDefault(require("../models/brand"));
const addComment = async (req, res, next) => {
    const brandId = req.params.id;
    try {
        // Validate request body
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { content } = req.body;
        const brand = await brand_1.default.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        const author = brand.author;
        console.log(author + ' ' + brandId);
        const newComment = new comment_1.default({
            content,
            author: author,
            brand_id: brandId
        });
        await newComment.save();
        return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    }
    catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.default = {
    addComment
};
