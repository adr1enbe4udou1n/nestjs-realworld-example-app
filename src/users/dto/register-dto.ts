import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'argon2';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../user.entity';

export class RegisterDTO {
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

  async makeUser(): Promise<User> {
    return plainToClass(User, {
      name: this.username,
      email: this.email,
      password: await hash(this.password),
    });
  }
}

export class RegisterCommand {
  @ApiProperty()
  user: RegisterDTO;
}
