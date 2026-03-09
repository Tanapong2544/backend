import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { SellersService } from '../sellers/sellers.service';
import { CreateSellerDto } from './dto/register-seller.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sellersService: SellersService,
  ) {}

  async registerSeller(sellerDto: CreateSellerDto) {
    const { username, password, firstName, lastName, phone } = sellerDto;

    const existingUser = await this.usersService.findOne(username);
    if (existingUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      username,
      password: hashedPassword,
      role: UserRole.SELLER,
    });

    try {
      const seller = await this.sellersService.create({
        userId: user.id,
        firstName,
        lastName,
        phone,
      });

      return {
        message: 'Seller registered successfully',
        sellerId: seller.id,
        userId: user.id,
      };
    } catch (error) {
      return error;
    }
  }

  async register(registerDto: CreateAuthDto) {
    const { username, password, firstName, lastName, phone } = registerDto;

    const existingUser = await this.usersService.findOne(username);
    if (existingUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findOneForLogin(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
