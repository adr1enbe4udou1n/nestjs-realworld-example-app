import { ProfileDTO } from './dto/profile.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async get(username: string, currentUser: User | null = null) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { name: username },
      include: { following: true },
    });
    return ProfileDTO.map(user, currentUser);
  }

  async follow(username: string, follow: boolean, currentUser: User) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { name: username },
    });

    const updatedUser = follow
      ? await this.prisma.user.update({
          where: { id: user.id },
          data: {
            following: {
              create: {
                followerId: currentUser.id,
              },
            },
          },
          include: { following: true },
        })
      : await this.prisma.user.update({
          where: { id: user.id },
          data: {
            following: {
              delete: {
                followerId_followingId: {
                  followerId: currentUser.id,
                  followingId: user.id,
                },
              },
            },
          },
          include: { following: true },
        });

    return ProfileDTO.map(updatedUser, currentUser);
  }
}
