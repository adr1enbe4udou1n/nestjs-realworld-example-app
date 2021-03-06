import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UserResponse } from '../user/dto/current-user.dto';
import { LoginUserRequest } from './dto/login.dto';
import { NewUserRequest } from './dto/register.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User and Authentication')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    operationId: 'CreateUser',
    summary: 'Register a new user',
    description: 'Register a new user',
  })
  @Post()
  @HttpCode(200)
  @ApiBody({
    description: 'Details of the new user to register',
    type: NewUserRequest,
  })
  @ApiResponse({ type: UserResponse })
  async register(@Body() command: NewUserRequest): Promise<UserResponse> {
    return {
      user: await this.authService.getUserWithToken(
        await this.usersService.register(command.user),
      ),
    };
  }

  @ApiOperation({
    operationId: 'Login',
    summary: 'Existing user login',
    description: 'Login for existing user',
  })
  @Post('login')
  @HttpCode(200)
  @ApiBody({
    description: 'Credentials to use',
    type: LoginUserRequest,
  })
  @ApiResponse({ type: UserResponse })
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() command: LoginUserRequest,
    @Request() req,
  ): Promise<UserResponse> {
    return { user: await this.authService.getUserWithToken(req.user) };
  }
}
