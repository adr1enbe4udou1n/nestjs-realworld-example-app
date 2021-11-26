import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  public async update(dto: UpdateUserDTO, user: User): Promise<User> {
    if (
      dto.email &&
      (await this.userRepository.count({
        email: dto.email,
        id: { $ne: user.id },
      })) > 0
    ) {
      throw new BadRequestException('This email is already used');
    }

    await this.userRepository.persistAndFlush(UpdateUserDTO.map(dto, user));
    return user;
  }
}
