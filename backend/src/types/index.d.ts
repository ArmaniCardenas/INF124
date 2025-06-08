import { Document, LeanDocument } from 'mongoose';
import { IUser } from "../infrastructure/database/models/userModel";
import { Document as DocEntity } from '../domain/entities/Document';

declare global {
  namespace Express {
    interface Request {
      user?: LeanDocument<IUser>; 
      document?: LeanDocument<DocEntity>; 
    }
  }
}
