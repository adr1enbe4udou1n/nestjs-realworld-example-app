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

  async map() {
    const user = new User();
    user.name = this.username;
    user.email = this.email;
    user.password = await hash(this.password);
    return user;
  }
}

export class NewUserRequest {
  @ApiProperty()
  user: NewUserDTO;
}
