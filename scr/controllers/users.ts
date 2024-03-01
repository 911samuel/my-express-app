import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/users";

require("dotenv").config({ path: ".env" });

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req.body);
    console.log(errors)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, username, email, password, role, profile } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role,
      profile,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { _id: savedUser._id },
      process.env.LOGIN_SECRET || "I0H1A9G2sam",
      { expiresIn: "1d" }
    );

    if (!token) {
      throw new Error("Failed to generate token");
    }

    const userWithoutPassword = { ...savedUser.toObject(), password: undefined };

    return res.status(200).json({
      message: "Registration successful",
      token, userWithoutPassword
    });
  } catch (error) {
    console.error("Error in Register:", error);
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.LOGIN_SECRET || "I0H1A9G2sam",
      { expiresIn: "1d" }
    );

    if (!token) {
      throw new Error("Failed to generate token");
    }

    const userWithoutPassword = { ...user.toObject(), password: undefined };

    return res.status(200).json({
      message: "Login successful",
      token, userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const userId  = req.params.id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, username, email, password, role, profile } = req.body;

    const updateFields: Partial<IUser> = {};

    if (firstname) updateFields.firstname = firstname;
    if (lastname) updateFields.lastname = lastname;
    if(username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    if (role) updateFields.role = role;
    if (profile) updateFields.profile = profile ;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithoutPassword = { ...updatedUser.toObject(), password: undefined };

    return res
      .status(200)
      .json({ message: "User updated successfully", user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

const delete1 = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    await User.deleteMany({});
    return res
      .status(200)
      .json({ message: "All users deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, update, delete1, deleteAll };
