import { Injectable, Logger } from '@nestjs/common';
import { name, internet, lorem, random, datatype } from 'faker';
import { hash } from 'argon2';
import { User } from './users/user.entity';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class Seeder {
  constructor(
    private readonly em: EntityManager,
    private readonly logger: Logger,
  ) {}
  async seed() {
    await this.em.nativeDelete(User, {});

    for (let i = 1; i <= 50; i++) {
      const user = this.em.create(User, {
        username: name.findName(),
        email: internet.email(),
        password: await hash('password'),
        bio: lorem.paragraphs(3),
        image: internet.avatar(),
      });

      this.em.persist(user);
    }

    await this.em.flush();

    const users = await this.em.find(User, {});

    users.forEach((u) => {
      u.followers.add(...random.arrayElements(users, datatype.number(5)));
    });

    this.em.flush();

    this.logger.debug('Successfuly completed seeding users...');
  }
}
