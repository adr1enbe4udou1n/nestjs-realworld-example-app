import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { NewUserDTO } from './dto/register.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  public async register(dto: NewUserDTO) {
    if ((await this.prisma.user.count({ where: { email: dto.email } })) > 0) {
      throw new BadRequestException('This email is already used');
    }

    return await this.prisma.user.create({
      data: {
        name: dto.username,
        email: dto.email,
        password: await hash(dto.password),
      },
    });
  }
}
