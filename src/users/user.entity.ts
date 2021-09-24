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

  @Property({ unique: true })
  @IsEmail()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property({ nullable: true, columnType: 'text' })
  bio?: string;

  @Property({ nullable: true })
  image?: string;

  @ManyToMany(() => User, (u) => u.followers, {
    hidden: true,
  })
  following = new Collection<User>(this);

  @ManyToMany(() => User, (u) => u.following, {
    owner: true,
    pivotTable: 'follower_user',
    joinColumn: 'following_id',
    inverseJoinColumn: 'follower_id',
    hidden: true,
  })
  followers = new Collection<User>(this);

  @OneToMany(() => Article, (a) => a.author, {
    hidden: true,
    inverseJoinColumn: 'author_id',
  })
  articles = new Collection<Article>(this);

  @OneToMany(() => Comment, (c) => c.author, {
    hidden: true,
    inverseJoinColumn: 'author_id',
  })
  comments = new Collection<Comment>(this);

  @ManyToMany(() => Article, (a) => a.favoredUsers, {
    hidden: true,
  })
  favoriteArticles = new Collection<Article>(this);

  @Property({ columnType: 'timestamp' })
  created_at: Date;

  @Property({ columnType: 'timestamp' })
  updated_at: Date;
}
