import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';
import { Article } from './article.entity';

@Entity({ collection: 'comments' })
export class Comment extends BaseEntity {
  @Property()
  body: string;

  @ManyToOne({ joinColumn: 'article_id' })
  article: Article;

  @ManyToOne({ joinColumn: 'author_id' })
  author: User;
}
