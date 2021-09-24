import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register-dto';
import { User } from './user.entity';
import { hash } from 'argon2';
import { Mapper } from '@automapper/types';
import { InjectMapper } from '@automapper/nestjs';
import { CurrentUserDTO } from '../user/dto/current-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectMapper()
    private mapper: Mapper,
  ) {}

  public async register(data: RegisterDTO) {
    const user = this.mapper.map(data, User, RegisterDTO);
    user.password = await hash(data.password);

    //await this.userRepository.persistAndFlush(data);

    return this.mapper.map(user, CurrentUserDTO, User);
  }
}
