import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { HasTimestamps } from '../../has-timestamps';
import { User } from '../../users/user.entity';
import { Article } from '../article.entity';

@Entity({ collection: 'comments' })
export class Comment implements HasTimestamps {
  @PrimaryKey()
  id?: number;

  @ManyToOne()
  article: Article;

  @ManyToOne()
  author: User;

  @Property({ columnType: 'text' })
  body: string;

  @Property({ columnType: 'timestamp' })
  createdAt?: Date;

  @Property({ columnType: 'timestamp' })
  updatedAt?: Date;

  constructor(comment: Partial<Comment> = {}) {
    Object.assign(this, comment);
  }
}
