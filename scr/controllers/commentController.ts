import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Comment, { IComment } from '../models/comment';
import Brand, { IBrand } from '../models/brand';
import User, { IUser } from '../models/user';

interface RequestWithBrand extends Request {
    brand?: IBrand;
    user?: IUser;
}

const addComment = async (
    req: RequestWithBrand,
    res: Response,
    next: NextFunction
) => {
    const brandId = req.params.id;
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content} = req.body;

        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        const author = brand.author;

        const newComment: IComment = new Comment({
            content,
            author: author,
            brand_id: brandId
        });

        await newComment.save();

        return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
    addComment
};