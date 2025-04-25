import User from "../database/models/userModel";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';


export const userVerification = (req: Request, res: Response) => {
  const token = req.cookies.token


  if (!token) {
    res.json({ status: false })
    return;
  }
  jwt.verify(token, "secret_key", async (err: jwt.VerifyErrors | null, data:any ) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }

  })
}