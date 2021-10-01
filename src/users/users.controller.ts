import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEnvelope } from '../user/dto/current-user.dto';
import { LoginCommand } from './dto/login.dto';
import { RegisterCommand } from './dto/register.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User and Authentication')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user',
  })
  @Post()
  @ApiResponse({ type: UserEnvelope })
  async register(@Body() command: RegisterCommand) {
    return { user: await this.usersService.register(command.user) };
  }

  @ApiOperation({
    summary: 'Existing user login',
    description: 'Login for existing user',
  })
  @Post('login')
  @ApiResponse({ type: UserEnvelope })
  async login(@Body() command: LoginCommand) {
    return { user: await this.usersService.login(command.user) };
  }
}
