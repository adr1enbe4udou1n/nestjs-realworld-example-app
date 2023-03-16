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

  static map(dto: UpdateUserDTO, user: User) {
    user.name = dto.username ?? user.name;
    user.email = dto.email ?? user.email;
    user.bio = dto.bio ?? user.bio;
    user.image = dto.image ?? user.image;
    return user;
  }
}

export class UpdateUserRequest {
  @ApiProperty()
  user: UpdateUserDTO;
}
