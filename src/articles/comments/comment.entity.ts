import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { HasTimestamps } from '../../has-timestamps';
import { User } from '../../users/user.entity';
import { Article } from '../article.entity';

@Entity({ collection: 'comments' })
export class Comment implements HasTimestamps {
  @PrimaryKey()
  id: number;

  @ManyToOne({ onDelete: 'cascade' })
  article: Article;

  @ManyToOne()
  author: User;

  @Property({ columnType: 'text' })
  body: string;

  @Property({ columnType: 'timestamp' })
  created_at: Date;

  @Property({ columnType: 'timestamp' })
  updated_at: Date;
}
