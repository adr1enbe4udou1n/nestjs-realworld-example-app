import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
}

export class UpdateUserRequest {
  @ApiProperty()
  user: UpdateUserDTO;
}
