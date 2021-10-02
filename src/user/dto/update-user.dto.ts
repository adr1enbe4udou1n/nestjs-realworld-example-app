import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../../users/user.entity';

export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  username?: string;

  @ApiProperty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  image?: string;

  map(user: User) {
    user.name = this.username ?? user.name;
    user.email = this.email ?? user.email;
    user.bio = this.bio ?? user.bio;
    user.image = this.image ?? user.image;
    return user;
  }
}

export class UpdateUserRequest {
  @ApiProperty()
  user: UpdateUserDTO;
}
