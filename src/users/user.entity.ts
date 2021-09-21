import { IsEmail } from 'class-validator';
import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Article } from '../article/article.entity';
import { Comment } from '../article/comment.entity';

@Entity({ collection: 'users' })
export class User extends BaseEntity {
  @Property()
  username: string;

  @Property()
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

  @ManyToMany({
    entity: () => User,
    inversedBy: (u) => u.following,
    owner: true,
    pivotTable: 'follower_user',
    joinColumn: 'follower_id',
    inverseJoinColumn: 'following_id',
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
    pivotTable: 'article_favorite',
    joinColumn: 'article_id',
    inverseJoinColumn: 'user_id',
    hidden: true,
  })
  favoriteArticles = new Collection<Article>(this);
}
