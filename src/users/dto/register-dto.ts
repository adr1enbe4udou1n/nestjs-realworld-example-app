import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class RegisterCommand {
  @ApiProperty()
  user: RegisterDTO;
}
