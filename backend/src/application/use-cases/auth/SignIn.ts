// import { IUserRepository } from '../../../domain/repositories/IUserRepository';
// import bcrypt from 'bcrypt';
// import { User } from '../../../domain/entities/User';
// import { IUserRepository } from '../../../domain/repositories/IUserRepository';
// import bcrypt from 'bcrypt';
// import { User } from '../../../domain/entities/User';

// export class SignIn {
//   constructor(private userRepo: IUserRepository) {}
// export class SignIn {
//   constructor(private userRepo: IUserRepository) {}

//   async execute(email: string, password: string): Promise<User> {
//     const user = await this.userRepo.findByEmail(email);
//     if (!user) {
//       throw new Error('Invalid email or password');
//     }

//     const match = await bcrypt.compare(password, user.passwordHash);
//     if (!match) {
//       throw new Error('Invalid email or password');
//     }

//     return user;
//   }
// }

import User from '../../../infrastructure/database/models/userModel';
import { createSecretToken } from '../../../infrastructure/auth/secretToken';
import bcrypt from "bcrypt";
import { RequestHandler } from 'express';

export const Signin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      res.json({message:'All fields are required'});
      return;
    }

    const user = await User.findOne({ email });
//   async execute(email: string, password: string): Promise<User> {
//     const user = await this.userRepo.findByEmail(email);
//     if (!user) {
//       throw new Error('Invalid email or password');
//     }

//     const match = await bcrypt.compare(password, user.passwordHash);
//     if (!match) {
//       throw new Error('Invalid email or password');
//     }

//     return user;
//   }
// }

import User from '../../../infrastructure/database/models/userModel';
import { createSecretToken } from '../../../infrastructure/auth/secretToken';
import bcrypt from "bcrypt";
import { RequestHandler } from 'express';

export const Signin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      res.json({message:'All fields are required'});
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.json({ message: "Incorrect password or email" });
      return;
      res.json({ message: "Incorrect password or email" });
      return;
    }

    const auth = await bcrypt.compare(password,user.password)

    if (!auth) {
      res.json({message:'Incorrect password or email' }) 
      return;
    }
     const token = createSecretToken(user._id.toString());
     res.cookie("token", token, {
       httpOnly: true,
       maxAge: 3600000,
       path: '/',
     });

     res.status(201).json({ message: "User logged in successfully", success: true });

  } catch (error) {
    console.error(error);
  }
}

