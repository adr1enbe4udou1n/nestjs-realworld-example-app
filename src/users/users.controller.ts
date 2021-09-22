import { Body, Controller, Post } from '@nestjs/common';
import { UserEnvelope } from 'src/user/dto/current-user-dto';
import { LoginCommand } from './dto/login-dto';
import { RegisterCommand } from './dto/register-dto';

@Controller('users')
export class UsersController {
  @Post()
  async register(
    @Body() registerCommand: RegisterCommand,
  ): Promise<UserEnvelope> {
    const user = {
      email: registerCommand.user.email,
      username: registerCommand.user.username,
      bio: '',
      image: '',
      token: '',
    };
    return { user };
  }

  @Post('login')
  async login(@Body() loginCommand: LoginCommand): Promise<UserEnvelope> {
    const user = {
      email: loginCommand.user.email,
      username: '',
      bio: '',
      image: '',
      token: '',
    };
    return { user };
  }
}
