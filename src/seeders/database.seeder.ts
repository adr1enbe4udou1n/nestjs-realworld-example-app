import type { EntityManager } from '@mikro-orm/core';
import { faker, Seeder } from '@mikro-orm/seeder';
import { hash } from 'argon2';
import { Article } from '../articles/article.entity';
import { User } from '../users/user.entity';
import { capitalize } from 'lodash';
import { Tag } from '../tags/tag.entity';
import { Comment } from '../articles/comments/comment.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users: User[] = [];
    const articles: Article[] = [];

    for (let i = 1; i <= 50; i++) {
      users.push(
        em.create(User, {
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: await hash('password'),
          bio: faker.lorem.paragraphs(3),
          image: faker.internet.avatar(),
        }),
      );
    }

    em.persist(users);

    users.forEach((u) => {
      u.followers.add(
        ...faker.random.arrayElements(users, faker.datatype.number(5)),
      );
    });

    for (let i = 1; i <= 500; i++) {
      const title = capitalize(
        faker.unique(() => faker.lorem.words(faker.datatype.number(5)), []),
      );

      const article = em.create(Article, {
        title,
        description: faker.lorem.paragraph(),
        body: faker.lorem.paragraphs(5),
        author: faker.random.arrayElement(users),
        favoredUsers: faker.random.arrayElements(
          users,
          faker.datatype.number(5),
        ),
        createdAt: faker.date.recent(90),
      });

      for (let i = 1; i <= faker.datatype.number(10); i++) {
        article.comments.add(
          em.create(Comment, {
            article,
            author: faker.random.arrayElement(users),
            body: faker.lorem.paragraphs(2),
            createdAt: faker.date.recent(7),
          }),
        );
      }

      articles.push(article);
    }

    em.persist(articles);

    for (let i = 1; i <= 100; i++) {
      const tag = em.create(Tag, {
        name: `${faker.lorem.word()} ${i}`,
        articles: faker.random.arrayElements(
          articles,
          faker.datatype.number(10),
        ),
      });

      em.persist(tag);
    }

    await em.flush();
  }
}
