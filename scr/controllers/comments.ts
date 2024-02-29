import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Comment, { IComment } from '../models/comments';
import Blog, { IBlog } from "../models/blogs";
import User, { IUser } from '../models/users';

interface RequestWithBlog extends Request {
    blog?: IBlog;
    user?: IUser;
}

const add = async (req: RequestWithBlog, res: Response, next: NextFunction) => {
    const blogId = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user._id; 
        const { content } = req.body;

        const brand = await Blog.findById(blogId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        const newComment: IComment = new Comment({
            content,
            user_id: userId,
            blog_id: blogId
        });

        await newComment.save();

        return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content } = req.body;

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        return res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const delete1 = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { add, update, delete1 };
