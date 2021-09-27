import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEnvelope } from '../user/dto/current-user.dto';
import { LoginCommand } from './dto/login.dto';
import { RegisterCommand } from './dto/register.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiResponse({ type: UserEnvelope })
  async register(
    @Body() registerCommand: RegisterCommand,
  ): Promise<UserEnvelope> {
    return { user: await this.usersService.register(registerCommand.user) };
  }

  @Post('login')
  @ApiResponse({ type: UserEnvelope })
  async login(@Body() loginCommand: LoginCommand): Promise<UserEnvelope> {
    return { user: await this.usersService.login(loginCommand.user) };
  }
}
