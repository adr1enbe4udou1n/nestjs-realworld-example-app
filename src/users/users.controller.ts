import { Body, Controller, Post } from '@nestjs/common';
import { UserEnvelope } from '../user/dto/current-user-dto';
import { LoginCommand } from './dto/login-dto';
import { RegisterCommand } from './dto/register-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async register(
    @Body() registerCommand: RegisterCommand,
  ): Promise<UserEnvelope> {
    return { user: await this.usersService.register(registerCommand.user) };
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
