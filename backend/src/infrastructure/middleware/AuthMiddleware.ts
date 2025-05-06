import User from "../database/models/userModel";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';


export const userVerification = (req: Request, res: Response) => {
  const token = req.cookies.token


  if (!token) {
    res.json({ success: false })
    return;
  }
  jwt.verify(token, "secret_key", async (err: jwt.VerifyErrors | null, data:any ) => {
    if (err) {
     return res.json({ success: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ success: true, user: user.username })
      else return res.json({ success: false })
    }

  })
}