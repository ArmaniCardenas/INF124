import { Document, LeanDocument } from 'mongoose';
import { IUser } from "../infrastructure/database/models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: LeanDocument<IUser>; 
    }
  }
}
