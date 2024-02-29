import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    author: any;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profile: string;
}

const userSchema: Schema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    profile: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;