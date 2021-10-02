import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { Article } from '../articles/article.entity';
import { Comment } from '../articles/comments/comment.entity';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { hash } from 'argon2';
import { capitalize } from 'lodash';
import { name, internet, lorem, random, datatype, unique, date } from 'faker';

@Injectable()
export class DatabaseRefreshService {
  constructor(
    private readonly consoleService: ConsoleService,
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

    for (let i = 1; i <= 50; i++) {
      users.push(
        this.em.create(User, {
          name: name.findName(),
          email: internet.email(),
          password: await hash('password'),
          bio: lorem.paragraphs(3),
          image: internet.avatar(),
        }),
      );
    }

    this.em.persist(users);

    console.info('Users generated !');

    users.forEach((u) => {
      u.followers.add(...random.arrayElements(users, datatype.number(5)));
    });

    for (let i = 1; i <= 500; i++) {
      const title = capitalize(unique(() => lorem.words(datatype.number(5))));

      const article = this.em.create(Article, {
        title,
        description: lorem.paragraph(),
        body: lorem.paragraphs(5),
        author: random.arrayElement(users),
        favoredUsers: random.arrayElements(users, datatype.number(5)),
        created_at: date.recent(90),
      });

      for (let i = 1; i <= datatype.number(10); i++) {
        article.comments.add(
          this.em.create(Comment, {
            body: lorem.paragraphs(2),
            author: random.arrayElement(users),
            created_at: date.recent(7),
          }),
        );
      }

      articles.push(article);
    }

    this.em.persist(articles);

    console.info('Articles generated !');

    for (let i = 1; i <= 100; i++) {
      const tag = this.em.create(Tag, {
        name: `${lorem.word()} ${i}`,
        articles: random.arrayElements(articles, datatype.number(10)),
      });

      this.em.persist(tag);
    }

    console.info('Tags generated !');

    await this.em.flush();
  };
}
