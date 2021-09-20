import { IsEmail } from 'class-validator';
import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRepository } from './user.repository';

@Entity()
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id: number;

  @Property()
  username: string;

  @Property()
  @IsEmail()
  email: string;

  @Property()
  password: string;

  @Property({ nullable: true, columnType: 'text' })
  bio: string;

  @Property({ nullable: true })
  image: string;

  @Property({ columnType: 'timestamp' })
  created_at = Date.now;

  @Property({ columnType: 'timestamp' })
  updated_at = Date.now;
}
