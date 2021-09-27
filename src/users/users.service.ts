import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { User } from './user.entity';
import { CurrentUserDTO } from '../user/dto/current-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { hash, verify } from 'argon2';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private jwtService: JwtService,
  ) {}

  public async register(data: RegisterDTO) {
    const user = await plainToClass(User, {
      name: data.username,
      email: data.email,
      password: await hash(data.password),
    });

    if ((await this.userRepository.count({ email: user.email })) > 0) {
      throw new BadRequestException('This email is already used');
    }

    await this.userRepository.persistAndFlush(user);

    return CurrentUserDTO.fromUser(
      user,
      this.jwtService.sign({ id: user.id, name: user.name, email: user.email }),
    );
  }

  public async login(data: LoginDTO) {
    const user = await this.userRepository.findOne({ email: data.email });

    if (user === null || !(await verify(user.password, data.password))) {
      throw new BadRequestException('Bad credentials');
    }

    return CurrentUserDTO.fromUser(
      user,
      this.jwtService.sign({ id: user.id, name: user.name, email: user.email }),
    );
  }
}
