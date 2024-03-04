import mongoose, { Document, Schema } from 'mongoose';
export interface IBlog extends Document {
    title: string;
    author: string;
    category: string;
    description?: string;
    imgUrl?: string;
}

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    category: { type: String},
    description: { type: String },
    imgUrl: { type: String }
}, { timestamps: true });

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;