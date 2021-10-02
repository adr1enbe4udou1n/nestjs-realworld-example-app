import { ApiProperty } from '@nestjs/swagger';
import { UserService } from '../../user/user.service';
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

  static map(user: User, userService: UserService): ProfileDTO {
    const dto = new ProfileDTO();
    dto.username = user.name;
    dto.bio = user.bio;
    dto.image = user.image;
    dto.following = user.followers
      .getItems()
      .some((u) => u.id === userService.user.id);
    return dto;
  }
}

export class ProfileResponse {
  @ApiProperty()
  profile: ProfileDTO;
}
