import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../users/user.entity';
import { ProfileDTO } from './dto/profile.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async get(username: string, currentUser: User | null = null) {
    const user = await this.userRepository.findOneOrFail(
      { name: username },
      {
        populate: ['followers'],
      },
    );
    return ProfileDTO.map(user, currentUser);
  }

  async follow(username: string, follow: boolean, currentUser: User) {
    const user = await this.userRepository.findOneOrFail(
      { name: username },
      {
        populate: ['followers'],
      },
    );

    const followedUser = user.followers
      .getItems()
      .find((u) => u.id === currentUser.id);

    if (follow) {
      if (!followedUser) {
        user.followers.add(currentUser);
      }
    } else {
      if (followedUser) {
        user.followers.remove(followedUser);
      }
    }

    await this.userRepository.flush();

    return ProfileDTO.map(user, currentUser);
  }
}
