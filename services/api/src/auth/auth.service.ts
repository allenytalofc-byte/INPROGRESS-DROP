import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwt: JwtService) {}

  async register(data: { email: string; password: string; name?: string; role?: 'customer' | 'vendor' }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already used');
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await this.usersService.create({
      email: data.email,
      passwordHash,
      name: data.name || null,
      role: data.role || 'customer',
    });
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user };
  }
}