import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';

export class ProfileDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  following: boolean;

  static map(user: User, currentUser: User | null) {
    const dto = new ProfileDTO();
    dto.username = user.name;
    dto.bio = user.bio;
    dto.image = user.image;
    dto.following = user.followers
      .toArray()
      .some((u) => u.id === currentUser?.id);
    return dto;
  }
}

export class ProfileResponse {
  @ApiProperty()
  profile: ProfileDTO;
}
