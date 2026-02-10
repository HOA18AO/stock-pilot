import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    plainPassword: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user || !user.active || !user.password) return null;
    const ok = await bcrypt.compare(plainPassword, user.password);
    if (!ok) return null;
    const rest = { ...user };
    delete (rest as Record<string, unknown>).password;
    return rest;
  }

  login(user: UserWithoutPassword): { access_token: string } {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async getMe(userId: number): Promise<UserWithoutPassword> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const rest = { ...user };
    delete (rest as Record<string, unknown>).password;
    return rest;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    // Validate password is not same as current
    if (currentPassword === newPassword) {
      throw new BadRequestException('New password cannot be the same as current password');
    }

    // Get user
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }
}
