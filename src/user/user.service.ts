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

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: dto.username ?? user.name,
        email: dto.email ?? user.email,
        bio: dto.bio ?? user.bio,
        image: dto.image ?? user.image,
      },
    });
  }
}
