import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../users/user.entity';
import { ProfileDTO } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly userService: UserService,
  ) {}

  async get(username: string) {
    const user = await this.userRepository.findOneOrFail({ name: username }, [
      'followers',
    ]);
    return ProfileDTO.fromUser(user, this.userService);
  }

  async follow(username: string, follow: boolean) {
    const user = await this.userRepository.findOneOrFail({ name: username }, [
      'followers',
    ]);

    const followedUser = user.followers
      .getItems()
      .find((u) => u.id === this.userService.user.id);

    if (follow) {
      if (!followedUser) {
        user.followers.add(this.userService.user);
      }
    } else {
      if (followedUser) {
        user.followers.remove(followedUser);
      }
    }

    await this.userRepository.flush();

    return ProfileDTO.fromUser(user, this.userService);
  }
}