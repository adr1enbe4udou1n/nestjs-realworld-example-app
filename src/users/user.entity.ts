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
  bio = '';

  @Property()
  image = '';

  @Property({ hidden: true })
  password: string;
}
