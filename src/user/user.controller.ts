import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserEnvelope } from './dto/current-user-dto';
import { UpdateUserCommand } from './dto/update-user-dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async current(): Promise<UserEnvelope> {
    return { user: this.userService.current() };
  }

  @Put()
  async update(
    @Body() updateUserCommand: UpdateUserCommand,
  ): Promise<UserEnvelope> {
    return { user: await this.userService.update(updateUserCommand.user) };
  }
}
