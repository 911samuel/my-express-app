import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any; 
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Missing Authorization Header' });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET || 'secret');
        (req as AuthenticatedRequest).user = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};

export default authenticate;
