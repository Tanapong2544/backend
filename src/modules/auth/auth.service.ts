import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(username: string, pass: string) {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = await this.usersService.create({
      username,
      password: hashedPassword,
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(username: string, password: string) {
  try {
    const user = await this.usersService.findOne(username);
   
    if (!user) {
      throw new UnauthorizedException('ไม่พบชื่อผู้ใช้งาน');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };

  } catch (error) { 
    throw error;
  }
}
}
