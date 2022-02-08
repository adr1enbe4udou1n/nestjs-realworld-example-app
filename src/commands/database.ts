import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { Article } from '../articles/article.entity';
import { Comment } from '../articles/comments/comment.entity';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { hash } from 'argon2';
import { capitalize } from 'lodash';
import { faker } from '@faker-js/faker';

@Injectable()
export class DatabaseRefreshService {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
    const cli = this.consoleService.getCli();

    const groupCommand = this.consoleService.createGroupCommand(
      {
        command: 'db',
        description: 'Refresh and manage db data',
      },
      cli,
    );

    // create command
    this.consoleService.createCommand(
      {
        command: 'fresh',
        description: 'Reset database',
      },
      this.fresh,
      groupCommand,
    );

    this.consoleService.createCommand(
      {
        command: 'seed',
        description: 'Reset and seed fake data',
      },
      this.seed,
      groupCommand,
    );
  }

  fresh = async () => {
    await this.orm.getMigrator().up();

    await this.em.nativeDelete(Tag, {});
    await this.em.nativeDelete(Comment, {});
    await this.em.nativeDelete(Article, {});
    await this.em.nativeDelete(User, {});

    console.info('Database wiped !');
  };

  seed = async () => {
    await this.fresh();

    const users: User[] = [];
    const articles: Article[] = [];
    const em = this.em.fork();

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

    console.info('Users generated !');

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

    console.info('Articles generated !');

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

    console.info('Tags generated !');

    await em.flush();
  };
}
