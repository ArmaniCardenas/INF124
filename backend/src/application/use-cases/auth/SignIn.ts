import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import bcrypt from 'bcrypt';
import { User } from '../../../domain/entities/User';

export class SignIn {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
}
