import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { User } from '../../users/user.entity';

export class CurrentUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  token: string;

  static fromUser(user: User, token: string): CurrentUserDTO {
    return plainToClass(CurrentUserDTO, {
      username: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image,
      token,
    });
  }
}

export class UserEnvelope {
  @ApiProperty()
  user: CurrentUserDTO;
}
