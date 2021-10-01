import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { UserResponse } from './dto/current-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('User and Authentication')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'Get current user',
    description: 'Gets the currently logged-in user',
  })
  @Get()
  @ApiResponse({ type: UserResponse })
  async current() {
    return { user: await this.userService.current() };
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
  async update(@Body() command: UpdateUserRequest) {
    return { user: await this.userService.update(command.user) };
  }
}
