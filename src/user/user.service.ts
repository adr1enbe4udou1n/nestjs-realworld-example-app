import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async update(dto: UpdateUserDTO, user: User) {
    if (
      dto.email &&
      (await this.prisma.user.count({
        where: {
          email: dto.email,
          id: {
            not: user.id,
          },
        },
      })) > 0
    ) {
      throw new BadRequestException('This email is already used');
    }

    await this.prisma.user.update(UpdateUserDTO.map(dto, user));
    return user;
  }
}
