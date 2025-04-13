import mongoose from 'mongoose';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
  });
const UserModel = mongoose.model('User', userSchema);

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    const doc = await UserModel.findOne({ email });
    return doc ? new User(doc.id!, doc.email!, doc.passwordHash!) : null;

  }
  async create(data: { email: string; passwordHash: string }) {
    const doc = await UserModel.create(data);
    return new User(doc.id!, doc.email!, doc.passwordHash!);

  }
}
