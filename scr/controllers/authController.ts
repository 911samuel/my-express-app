import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

require('dotenv').config({ path: '.env' }); 

interface AuthController {
    register(req: Request, res: Response, next: NextFunction): void;
    login(req: Request, res: Response, next: NextFunction): void;
}

const authController: AuthController = {
    register: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { firstname, lastname, email, password, role, avatar } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser: IUser = new User({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role,
                avatar,
            });

            const savedUser = await newUser.save();

            const token = jwt.sign({ _id: savedUser._id }, process.env.LOGIN_SECRET || 'I0H1A9G2sam', { expiresIn: '1d' });

            if (!token) {
                throw new Error('Failed to generate token');
            }

            res.status(200).json({
                message: 'Registration successful',
                token,
                user: savedUser, 
            });
        } catch (error) {
            console.error('Error in Register:', error);
            next(error); 
        }
    },

    login: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            console.log(email + " " + password);

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ _id: user._id }, process.env.LOGIN_SECRET || 'I0H1A9G2sam', { expiresIn: '1d' });

            if (!token) {
                throw new Error('Failed to generate token');
            }

            res.status(200).json({
                message: 'Login successful',
                token,
                user: user, 
            });
        } catch (error) {
            next(error);
        }
    },
};

export default authController;
