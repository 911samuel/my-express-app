import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

require('dotenv').config();

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log("Token in isAdmin:", token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.LOGIN_SECRET!);

        console.log("Decoded Token in isAdmin:", decoded);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
        }

        next();
    } catch (error) {
        console.error("Error in isAdmin middleware:", error);
        return res.status(401).json({ message: 'Invalid token', error: error });
    }
};

export default isAdmin;
