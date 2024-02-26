import mongoose, { Document, Schema } from 'mongoose';
export interface IBrand extends Document {
    title: string;
    author: string;
    category: string;
    description?: string;
    avatar?: string;
}

const brandSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String },
    category: { type: String},
    description: { type: String },
    avatar: { type: String }
}, { timestamps: true });

const Brand = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;