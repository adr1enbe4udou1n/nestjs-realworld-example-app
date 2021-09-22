import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../users/user.entity';
import { Comment } from './comments/comment.entity';
import { Tag } from '../tags/tag.entity';
import { HasTimestamps } from '../has-timestamps';
import slugify from 'slugify';

@Entity({ collection: 'articles' })
export class Article implements HasTimestamps {
  @PrimaryKey()
  id: number;

  @ManyToOne({ joinColumn: 'user_id' })
  author: User;

  @Property()
  title: string;

  @Property({ unique: true })
  slug: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'text' })
  body: string;

  @ManyToMany(() => Tag, (t) => t.articles, {
    owner: true,
    pivotTable: 'article_tag',
    joinColumn: 'article_id',
    inverseJoinColumn: 'tag_id',
    hidden: true,
  })
  tags = new Collection<Tag>(this);

  @OneToMany(() => Comment, (c) => c.article, {
    inverseJoinColumn: 'article_id',
    hidden: true,
  })
  comments = new Collection<Comment>(this);

  @ManyToMany(() => User, (t) => t.favoriteArticles, {
    owner: true,
    pivotTable: 'article_favorite',
    joinColumn: 'article_id',
    inverseJoinColumn: 'user_id',
    hidden: true,
  })
  favoredUsers = new Collection<User>(this);

  @Property({ columnType: 'timestamp' })
  created_at: Date;

  @Property({ columnType: 'timestamp' })
  updated_at: Date;

  @BeforeCreate()
  async beforeCreate() {
    if (!this.slug) {
      this.slug = slugify(this.title, { lower: true });
    }
  }
}
