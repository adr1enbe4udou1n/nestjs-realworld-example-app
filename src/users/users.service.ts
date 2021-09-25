import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register-dto';
import { User } from './user.entity';
import { CurrentUserDTO } from '../user/dto/current-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  public async register(data: RegisterDTO) {
    const user = await data.makeUser();

    await this.userRepository.persistAndFlush(user);

    return CurrentUserDTO.fromUser(user);
  }
}
