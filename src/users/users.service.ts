import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register-dto';
import { User } from './user.entity';
import { CurrentUserDTO } from '../user/dto/current-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private jwtService: JwtService,
  ) {}

  public async register(data: RegisterDTO) {
    const user = await data.makeUser();

    if ((await this.userRepository.count({ email: user.email })) > 0) {
      throw new BadRequestException('This email is already used');
    }

    await this.userRepository.persistAndFlush(user);

    return CurrentUserDTO.fromUser(
      user,
      this.jwtService.sign({ id: user.id, name: user.name, email: user.email }),
    );
  }
}
