import { ApiProperty } from '@nestjs/swagger';
import { FollowerUser, User } from '../../generated/prisma/client';

export class ProfileDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  bio: string | null;

  @ApiProperty()
  image: string | null;

  @ApiProperty()
  following: boolean;

  static map(
    user: User & {
      following: FollowerUser[];
    },
    currentUser: User | null,
  ) {
    const dto = new ProfileDTO();
    dto.username = user.name;
    dto.bio = user.bio;
    dto.image = user.image;
    dto.following =
      currentUser != null &&
      user.following.some((follower) => follower.followerId === currentUser.id);
    return dto;
  }
}

export class ProfileResponse {
  @ApiProperty()
  profile: ProfileDTO;
}
