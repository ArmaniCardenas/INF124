import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import bcrypt from 'bcrypt';

export class SignUp {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email in use');
    const hash = await bcrypt.hash(password, 10);
    return this.userRepo.create({ email, passwordHash: hash });
  }
}
