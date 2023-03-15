import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../../users/user.entity';

export class UpdateUserDTO {
  @ApiPropertyOptional()
  @IsNotEmpty()
  username?: string;

  @ApiPropertyOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional()
  image?: string;

  public map(user: User) {
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
