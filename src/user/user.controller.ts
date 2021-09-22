import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserEnvelope } from './dto/current-user-dto';
import { UpdateUserCommand } from './dto/update-user-dto';

@Controller('user')
export class UserController {
  @Get()
  async current(): Promise<UserEnvelope> {
    const user = {
      email: 'sdf@sdf.fr',
      password: 'sdfsdf',
      username: 'john',
      bio: '',
      image: '',
      token: 'token',
    };
    return { user };
  }

  @Put()
  async update(
    @Body() updateUserCommand: UpdateUserCommand,
  ): Promise<UserEnvelope> {
    const user = {
      email: 'sdf@sdf.fr',
      password: 'sdfsdf',
      username: 'john',
      bio: '',
      image: '',
      token: 'token',
    };
    return { user };
  }
}
