import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { UserEnvelope } from './dto/current-user.dto';
import { UpdateUserCommand } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiResponse({ type: UserEnvelope })
  async current() {
    return { user: await this.userService.current() };
  }

  @UseGuards(AuthGuard)
  @Put()
  @ApiResponse({ type: UserEnvelope })
  async update(@Body() command: UpdateUserCommand) {
    return { user: await this.userService.update(command.user) };
  }
}
