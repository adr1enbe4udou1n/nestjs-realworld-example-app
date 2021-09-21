import { Injectable, Logger } from '@nestjs/common';
import { name, internet, lorem, random, datatype, unique, date } from 'faker';
import { User } from './users/user.entity';
import { EntityManager } from '@mikro-orm/core';
import { Comment } from './article/comment.entity';
import { Article } from './article/article.entity';
import { Tag } from './tag/tag.entity';
import { hash } from 'argon2';
import { capitalize } from 'lodash';

@Injectable()
export class Seeder {
  constructor(private readonly em: EntityManager) {}
  async seed() {
    await this.em.nativeDelete(Tag, {});
    await this.em.nativeDelete(Comment, {});
    await this.em.nativeDelete(Article, {});
    await this.em.nativeDelete(User, {});

    const users: User[] = [];
    const articles: Article[] = [];

    for (let i = 1; i <= 50; i++) {
      users.push(
        this.em.create(User, {
          username: name.findName(),
          email: internet.email(),
          password: await hash('password'),
          bio: lorem.paragraphs(3),
          image: internet.avatar(),
        }),
      );
    }

    this.em.persist(users);

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

    for (let i = 1; i <= 100; i++) {
      const tag = this.em.create(Tag, {
        name: `${lorem.word()} ${i}`,
        articles: random.arrayElements(articles, datatype.number(10)),
      });

      this.em.persist(tag);
    }

    await this.em.flush();
  }
}
