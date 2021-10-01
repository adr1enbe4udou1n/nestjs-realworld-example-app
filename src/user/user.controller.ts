import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { UserEnvelope } from './dto/current-user.dto';
import { UpdateUserCommand } from './dto/update-user.dto';
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
  @ApiResponse({ type: UserEnvelope })
  async current() {
    return { user: await this.userService.current() };
  }

  @ApiOperation({
    summary: 'Update current user',
    description: 'Updated user information for current user',
  })
  @Put()
  @ApiResponse({ type: UserEnvelope })
  async update(@Body() command: UpdateUserCommand) {
    return { user: await this.userService.update(command.user) };
  }
}
