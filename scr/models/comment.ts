import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: string; 
    brand_id: number; 
}

const commentSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    brand_id: {
        type: String, 
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
