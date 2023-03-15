import { ProfileDTO } from './dto/profile.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async get(username: string, currentUser: User | null = null) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { name: username },
      include: { followers: true },
    });
    return ProfileDTO.map(user, currentUser);
  }

  async follow(username: string, follow: boolean, currentUser: User) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { name: username },
      include: { followers: true },
    });

    if (follow) {
      await this.prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            connect: {
              followerId_followingId: {
                followerId: currentUser.id,
                followingId: user.id,
              },
            },
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            disconnect: {
              followerId_followingId: {
                followerId: currentUser.id,
                followingId: user.id,
              },
            },
          },
        },
      });
    }

    return ProfileDTO.map(user, currentUser);
  }
}
