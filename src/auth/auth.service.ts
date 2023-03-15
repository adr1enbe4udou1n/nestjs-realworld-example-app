import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/dto/current-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  public async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user?.password) {
      return null;
    }

    if (!(await verify(user.password, password))) {
      return null;
    }

    return user;
  }

  public async getUserWithToken(user: User) {
    return UserDTO.map(
      user,
      this.jwtService.sign({
        username: user.name,
        sub: user.id,
      }),
    );
  }
}
