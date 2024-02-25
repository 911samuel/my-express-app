import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

require('dotenv').config();

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
                avatar
            });

            const savedUser = await newUser.save();
            console.log(`New user created: ${savedUser}`);

            res.status(200).json({ user: savedUser });
        } catch (error) {
            console.error("Error in Register", error);
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
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'No user with that email found' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid Password' });
            }

            const token = jwt.sign({ _id: user._id }, process.env.LOGIN_SECRET!, { expiresIn: '1d' });

            res.status(200).json({ token, user });
        } catch (error) {
            console.error("Error in Login", error);
            next(error);
        }
    }
};

export default authController;
