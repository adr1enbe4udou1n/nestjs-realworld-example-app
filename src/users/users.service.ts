import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NewUserDTO } from './dto/register.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  public async register(dto: NewUserDTO) {
    if ((await this.userRepository.count({ email: dto.email })) > 0) {
      throw new BadRequestException('This email is already used');
    }

    const user = await NewUserDTO.map(dto);
    await this.userRepository.persistAndFlush(user);

    return user;
  }
}
