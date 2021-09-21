import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { User } from '../users/user.entity';
import { BaseEntity } from '../base.entity';
import { Comment } from './comment.entity';
import { Tag } from '../tag/tag.entity';

@Entity({ collection: 'articles' })
export class Article extends BaseEntity {
  @Property()
  title: string;

  @Property()
  slug: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'text' })
  body: string;

  @ManyToOne({ joinColumn: 'user_id' })
  author: User;

  @ManyToMany(() => Tag, (t) => t.articles, {
    pivotTable: 'article_tag',
    joinColumn: 'tag_id',
    inverseJoinColumn: 'article_id',
    hidden: true,
  })
  tags = new Collection<Tag>(this);

  @OneToMany(() => Comment, (c) => c.article, {
    inverseJoinColumn: 'article_id',
    eager: true,
    orphanRemoval: true,
  })
  comments = new Collection<Comment>(this);

  @ManyToMany(() => User, (t) => t.favoriteArticles, {
    pivotTable: 'article_favorite',
    joinColumn: 'user_id',
    inverseJoinColumn: 'article_id',
    hidden: true,
  })
  favoredUsers = new Collection<User>(this);
}
