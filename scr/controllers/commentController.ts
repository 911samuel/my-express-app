// commentController.ts

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Comment, { IComment } from '../models/comment';
import Brand, { IBrand } from "../models/brand";

interface RequestWithBrand extends Request {
    brand?: IBrand;
}

const addComment = async (
    req: RequestWithBrand,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        const userId = req.brand._id;
        const newComment: IComment = new Comment({
            content: req.body.content,
            author: userId,
            brand_id: id
        });

        await newComment.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
    addComment
};
