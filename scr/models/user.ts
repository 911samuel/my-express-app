import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    avatar: string;
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
    avatar: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;