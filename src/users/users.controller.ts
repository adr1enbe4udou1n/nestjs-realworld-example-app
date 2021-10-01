import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponse } from '../user/dto/current-user.dto';
import { LoginUserRequest } from './dto/login.dto';
import { NewUserRequest } from './dto/register.dto';
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
  @ApiBody({
    description: 'Details of the new user to register',
    type: NewUserRequest,
  })
  @ApiResponse({ type: UserResponse })
  async register(@Body() command: NewUserRequest) {
    return { user: await this.usersService.register(command.user) };
  }

  @ApiOperation({
    summary: 'Existing user login',
    description: 'Login for existing user',
  })
  @Post('login')
  @ApiBody({
    description: 'Credentials to use',
    type: LoginUserRequest,
  })
  @ApiResponse({ type: UserResponse })
  async login(@Body() command: LoginUserRequest) {
    return { user: await this.usersService.login(command.user) };
  }
}
