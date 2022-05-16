import { IsEmail } from 'class-validator';
import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Article } from '../articles/article.entity';
import { Comment } from '../articles/comments/comment.entity';
import { HasTimestamps } from '../has-timestamps';

@Entity({ collection: 'users' })
export class User implements HasTimestamps {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  @IsEmail()
  email: string;

  @Property()
  password?: string;

  @Property({ columnType: 'text' })
  bio?: string;

  @Property()
  image?: string;

  @ManyToMany(() => User, (u) => u.followers)
  following = new Collection<User>(this);

  @ManyToMany(() => User, (u) => u.following, {
    owner: true,
    pivotTable: 'follower_user',
    joinColumn: 'following_id',
    inverseJoinColumn: 'follower_id',
  })
  followers = new Collection<User>(this);

  @OneToMany(() => Article, (a) => a.author, {
    inverseJoinColumn: 'author_id',
  })
  articles = new Collection<Article>(this);

  @OneToMany(() => Comment, (c) => c.author, {
    inverseJoinColumn: 'author_id',
  })
  comments = new Collection<Comment>(this);

  @ManyToMany(() => Article, (a) => a.favoredUsers)
  favoriteArticles = new Collection<Article>(this);

  @Property({ columnType: 'timestamp' })
  createdAt: Date;

  @Property({ columnType: 'timestamp' })
  updatedAt: Date;

  constructor(user: Partial<User> = {}) {
    Object.assign(this, user);
  }
}
