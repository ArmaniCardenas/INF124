import { IUserRepository } from '../../../domain/repositories/IUserRepository';

// export class SignUp {
//   constructor(private userRepo: IUserRepository) {}

//   async execute(email: string, password: string) {
//     const existing = await this.userRepo.findByEmail(email);
//     if (existing) throw new Error('Email in use');
//     const hash = await bcrypt.hash(password, 10);
//     return this.userRepo.create({ email, passwordHash: hash });
//   }
// }

import User from '../../../infrastructure/database/models/userModel';
import { createSecretToken } from '../../../infrastructure/auth/secretToken';
import bcrypt from "bcrypt";
import { Request, Response, NextFunction, RequestHandler } from 'express';



// export const Signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, password, username, createdAt } = req.body;
//     const existingUser = await User.findOne({ email }); 
//     if (existingUser) {
//       return res.json({ message: "User already exists" });
//     }
//     const user = await User.create({ email, password, username, createdAt });
//     const token = createSecretToken(user._id.toString());
//     res.cookie("token", token, {
//       httpOnly: false,
//       secure: true
//     });
//     return res
//       .status(201)
//       .json({ message: "User signed in successfully", success: true, user });
//     next();
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

export const Signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({ message: "User already exists" });
      return;
    }

    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.status(201).json({
      message: "User signed in successfully",
      success: true,
      user,
    });

    // No need to return anything!
  } catch (error) {
    next(error);
  }
};