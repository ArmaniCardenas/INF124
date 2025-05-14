import UserModel from "../database/models/userModel";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, RequestHandler } from 'express';

export const userVerification: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ success: false, error: "No token" });
    return;             
  }

  let payload: { id: string };
  try {
    payload = jwt.verify(token, "secret_key") as { id: string };
  } catch {
    res.status(401).json({ success: false, error: "Invalid" });
    return;
  }

  UserModel.findById(payload.id).lean()
    .then(user => {
      if (!user) {
        res.status(401).json({ success: false, error: "Error" });
        return;
      }
      req.user = user;  
      next();           
    })
    .catch(() => {
      res.status(500).json({ success: false, error: "Server error " });
    });
};
export default userVerification;
