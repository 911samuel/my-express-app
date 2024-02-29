import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    user_id: number; 
    blog_id: number; 
}

const commentSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    },
    blog_id: {
        type: Number, 
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
