import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const newUser: IUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            profilePicture: req.body.profilePicture
        });

        const savedUser = await newUser.save();

        const { password, ...userWithoutPassword } = savedUser.toObject();

        const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET || 'I0H1A9G2sam', { expiresIn: '24h' });

        res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

const login =  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(401).json({ message: 'No user with that email found' });

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if(!isValidPassword) return res.status(401).json({ message: 'Invalid Password' });

        const token = jwt.sign({ _id: user._id}, process.env.SECRET || 'secret', {expiresIn: "1d"});

        const userWithoutPassword = { ...user.toJSON(), password: undefined };

        res.status(200).send({ token, user: userWithoutPassword });
    } catch (error) {
        console.log("Error in Login", error);
        next(error);
    }
}

export default { register, login };
