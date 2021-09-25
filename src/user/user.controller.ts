import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { UserEnvelope } from './dto/current-user-dto';
import { UpdateUserCommand } from './dto/update-user-dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async current(): Promise<UserEnvelope> {
    return { user: this.userService.current() };
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(
    @Body() updateUserCommand: UpdateUserCommand,
  ): Promise<UserEnvelope> {
    return { user: await this.userService.update(updateUserCommand.user) };
  }
}
