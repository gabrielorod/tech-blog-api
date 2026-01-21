import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import { User } from '@prisma/client';
import { PrismaClient } from 'generated/prisma/edge';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const { id, email, name } = user;

    const payload = {
      sub: id,
      email: email,
      name: name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await (this.prisma as PrismaClient).user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const passwordMatches = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    return user;
  }
}
