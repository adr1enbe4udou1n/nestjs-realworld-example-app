import {
  BeforeCreate,
  Cascade,
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

  @ManyToOne()
  author: User;

  @Property()
  title: string;

  @Property({ unique: true })
  slug?: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'text' })
  body: string;

  @ManyToMany(() => Tag, (t) => t.articles, {
    owner: true,
    pivotTable: 'article_tag',
  })
  tags = new Collection<Tag>(this);

  @OneToMany(() => Comment, (c) => c.article, { cascade: [Cascade.REMOVE] })
  comments = new Collection<Comment>(this);

  @ManyToMany(() => User, (t) => t.favoriteArticles, {
    owner: true,
    pivotTable: 'article_favorite',
  })
  favoredUsers = new Collection<User>(this);

  @Property({ columnType: 'timestamp' })
  createdAt?: Date;

  @Property({ columnType: 'timestamp' })
  updatedAt?: Date;

  @BeforeCreate()
  async beforeCreate() {
    if (!this.slug) {
      this.slug = slugify(this.title, { lower: true });
    }
  }

  constructor(article: Partial<Article> = {}) {
    Object.assign(this, article);
  }
}
