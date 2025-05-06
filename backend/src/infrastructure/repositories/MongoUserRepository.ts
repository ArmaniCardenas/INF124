import mongoose from 'mongoose';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { 
      type: String, 
      required: [true, "Your email address is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Your username is required"],
    },
    password: { 
      type: String, 
      required: [true, "Your password is required"], 
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  });

  userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
  });

const UserModel = mongoose.model('User', userSchema);

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    const doc = await UserModel.findOne({ email });
    return doc ? new User(doc.id!, doc.email!, doc.password!, doc.username!, doc.createdAt!) : null;

  }
  async create(data: { email: string; passwordHash: string }) {
    const doc = await UserModel.create(data);
    return new User(doc.id!, doc.email!, doc.password!, doc.username!, doc.createdAt!);

  }
}
