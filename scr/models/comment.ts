import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: string; 
    blog_id: string; 
}

const commentSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    blog_id: {
        type: Schema.Types.ObjectId,
        ref: 'brand', 
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
