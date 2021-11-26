import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponse } from './dto/current-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User and Authentication')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Get current user',
    description: 'Gets the currently logged-in user',
  })
  @Get()
  @ApiResponse({ type: UserResponse })
  async current(@Request() req): Promise<UserResponse> {
    return {
      user: await this.authService.getUserWithToken(req.user),
    };
  }

  @ApiOperation({
    summary: 'Update current user',
    description: 'Updated user information for current user',
  })
  @Put()
  @ApiBody({
    description: 'User details to update. At least one field is required.',
    type: UpdateUserRequest,
  })
  @ApiResponse({ type: UserResponse })
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() command: UpdateUserRequest,
    @Request() req,
  ): Promise<UserResponse> {
    return {
      user: await this.authService.getUserWithToken(
        await this.userService.update(command.user, req.user),
      ),
    };
  }
}
