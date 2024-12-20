import { ProfileDTO } from './dto/profile.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
      include: { following: true },
    });

    if (user.id === currentUser.id) {
      throw new BadRequestException('Cannot follow yourself');
    }

    if (follow && user.following.some((u) => u.followerId === currentUser.id)) {
      return ProfileDTO.map(user, currentUser);
    }

    if (
      !follow &&
      !user.following.some((u) => u.followerId === currentUser.id)
    ) {
      return ProfileDTO.map(user, currentUser);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        following: {
          ...(follow && {
            create: {
              followerId: currentUser.id,
            },
          }),
          ...(!follow && {
            delete: {
              followerId_followingId: {
                followerId: currentUser.id,
                followingId: user.id,
              },
            },
          }),
        },
      },
      include: { following: true },
    });

    return ProfileDTO.map(updatedUser, currentUser);
  }
}
