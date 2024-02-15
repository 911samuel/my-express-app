import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    destination?: string;
    email: string;
    phoneNumber?: number;
    age?: number;
    description?: string;
    avatar?: string;
}

const brandSchema: Schema = new Schema({
    name: { type: String, required: true },
    destination: { type: String },
    email: { type: String, required: true },
    phoneNumber: { type: Number },
    age: { type: Number },
    description: { type: String },
    avatar: { type: String }
}, { timestamps: true });

const Brand = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;
