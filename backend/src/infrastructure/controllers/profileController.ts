import { Request, Response } from 'express';
import UserModel from '../database/models/userModel';  

export async function getProfile(req: Request, res: Response) {
  res.json(req.user);
}

export async function updateProfile(req: Request, res: Response) {
  const { name, avatar } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.user!.id,
    { name, avatar },
    { new: true }
  );
  res.json(user);
}
