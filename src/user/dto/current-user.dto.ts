import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { User } from '../../users/user.entity';

export class UserDTO {
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

  static fromUser(user: User, token: string): UserDTO {
    return plainToClass(UserDTO, {
      username: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image,
      token,
    });
  }
}

export class UserResponse {
  @ApiProperty()
  user: UserDTO;
}
