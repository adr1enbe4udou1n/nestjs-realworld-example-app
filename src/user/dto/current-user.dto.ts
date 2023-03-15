import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';

export class UserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  token: string;

  static map(user: User, token: string) {
    const dto = new UserDTO();
    dto.username = user.name;
    dto.email = user.email;
    dto.bio = user.bio || '';
    dto.image = user.image || '';
    dto.token = token;
    return dto;
  }
}

export class UserResponse {
  @ApiProperty()
  user: UserDTO;
}
