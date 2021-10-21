import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Article } from '../articles/article.entity';

@Entity({ collection: 'tags' })
export class Tag {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @ManyToMany(() => Article, (a) => a.tags)
  articles = new Collection<Article>(this);

  constructor(tag: Partial<Tag> = {}) {
    Object.assign(this, tag);
  }
}
