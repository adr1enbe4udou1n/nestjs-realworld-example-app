import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Article } from '../articles/article.entity';
import { HasTimestamps } from '../has-timestamps';

@Entity({ collection: 'tags' })
export class Tag implements HasTimestamps {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @ManyToMany(() => Article, (a) => a.tags, {
    hidden: true,
  })
  articles = new Collection<Article>(this);

  @Property({ columnType: 'timestamp' })
  created_at: Date;

  @Property({ columnType: 'timestamp' })
  updated_at: Date;
}
