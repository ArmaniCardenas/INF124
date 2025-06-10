import { Request, Response } from 'express';
import UserModel from '../database/models/userModel';  
import bcrypt from 'bcrypt';


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

export async function changeEmail(req: Request, res: Response) {
  const { email } = req.body;

  // check if new email is taken
  const existing = await UserModel.findOne({ email });
  if (existing) {
    res.status(400).json({ error: 'Email already in use' });
    return;
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user!._id,
    { email },
    { new: true }
  );

  res.json({ message: 'Email updated', user });
}

export async function changeUsername(req: Request, res: Response) {
  const { username } = req.body;

  const existing = await UserModel.findOne({ username });
  if (existing) {
    res.status(400).json({ error: 'Username already taken' });
    return;
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user!._id,
    { username },
    { new: true }
  );

  res.json({ message: 'Username updated', user });
}


export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.user!._id);

  const isMatch = await bcrypt.compare(currentPassword, user!.password);
  if (!isMatch) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }
  // hashed using User mongoose schema
  user!.password = newPassword;
  await user!.save();

  res.json({ message: 'Password changed successfully' });
}

