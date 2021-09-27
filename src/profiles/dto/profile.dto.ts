import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
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

  static fromUser(user: User, userService: UserService) {
    return plainToClass(ProfileDTO, {
      username: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image,
      following: user.followers
        .getItems()
        .some((u) => u.id === userService.user.id),
    });
  }
}

export class ProfileEnvelope {
  @ApiProperty()
  profile: ProfileDTO;
}
