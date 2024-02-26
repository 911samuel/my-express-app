import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

require('dotenv').config();

const isUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log("Token in isUser:", token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.LOGIN_SECRET || 'I0H1A9G2sam');

        console.log("Decoded Token in isUser:", decoded);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Unauthorized: User is not a regular user' });
        }

        next();
    } catch (error) {
        console.error("Error in isUser middleware:", error);
        return res.status(401).json({ message: 'Invalid token', error: error });
    }
};

export default isUser;
