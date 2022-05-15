import type { EntityManager } from '@mikro-orm/core';
import { faker, Seeder } from '@mikro-orm/seeder';
import { hash } from 'argon2';
import { Article } from '../articles/article.entity';
import { User } from '../users/user.entity';
import { capitalize } from 'lodash';
import { Tag } from '../tags/tag.entity';
import { Comment } from '../articles/comments/comment.entity';
import { UserFactory } from '../users/user.factory';
import { TagFactory } from '../tags/tag.factory';
import { ArticleFactory } from '../articles/article.factory';
import { CommentFactory } from '../articles/comments/comment.factory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = await new UserFactory(em).create(50, {
      password: await hash('password'),
    });

    users.forEach((u) => {
      u.followers.add(
        ...faker.random.arrayElements(users, faker.datatype.number(5)),
      );
    });

    const tags = await new TagFactory(em).create(30);

    for (let i = 1; i <= 500; i++) {
      await new ArticleFactory(em)
        .each((article) => {
          article.comments.set(
            new CommentFactory(em).make(faker.datatype.number(10), {
              author: faker.random.arrayElement(users),
            }),
          );
        })
        .createOne({
          author: faker.random.arrayElement(users),
          favoredUsers: faker.random.arrayElements(
            users,
            faker.datatype.number(5),
          ),
          tags: faker.random.arrayElements(tags, faker.datatype.number(3)),
        });
    }
  }
}
