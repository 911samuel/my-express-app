import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user"; 

declare global {
    namespace Express {
      interface Request {
        authenticate(): boolean; 
        savedUser?: IUser; 
      }
    }
  }

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.authenticate()) {
    return next(); 
  }
  res.status(401).json({ message: "Unauthorized" });
};

const authorizeUserRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.savedUser as IUser; 
    if (user.role === role) {
      return next(); 
    }
    res.status(403).json({ message: "Forbidden" });
  };
};

const comment = {
  createComment: [
    authenticateUser, 
    authorizeUserRole("user"), 
    (req: Request, res: Response) => {
      res.status(200).json({ message: "Comment created successfully" });
    },
  ],
};

export default comment;
