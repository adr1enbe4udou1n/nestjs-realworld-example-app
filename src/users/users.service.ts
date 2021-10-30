import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { NewUserDTO } from './dto/register.dto';
import { User } from './user.entity';
import { UserDTO } from '../user/dto/current-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login.dto';
import { verify } from 'argon2';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private jwtService: JwtService,
  ) {}

  public async register(dto: NewUserDTO): Promise<UserDTO> {
    if ((await this.userRepository.count({ email: dto.email })) > 0) {
      throw new BadRequestException('This email is already used');
    }

    const user = await NewUserDTO.map(dto);
    await this.userRepository.persistAndFlush(user);

    return UserDTO.map(
      user,
      this.jwtService.sign({ id: user.id, name: user.name, email: user.email }),
    );
  }

  public async login(data: LoginUserDTO): Promise<UserDTO> {
    const user = await this.userRepository.findOne({ email: data.email });

    if (user === null || !(await verify(user.password, data.password))) {
      throw new BadRequestException('Bad credentials');
    }

    return UserDTO.map(
      user,
      this.jwtService.sign({ id: user.id, name: user.name, email: user.email }),
    );
  }
}
