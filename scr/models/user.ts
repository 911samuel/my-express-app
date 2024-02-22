import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    profilePicture: string;
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
    profilePicture: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;