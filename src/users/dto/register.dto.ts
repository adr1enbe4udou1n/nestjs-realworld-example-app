import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'argon2';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../user.entity';

export class NewUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  static async map(dto: NewUserDTO): Promise<User> {
    const user = new User();
    user.name = dto.username;
    user.email = dto.email;
    user.password = await hash(dto.password);
    return user;
  }
}

export class NewUserRequest {
  @ApiProperty()
  user: NewUserDTO;
}
