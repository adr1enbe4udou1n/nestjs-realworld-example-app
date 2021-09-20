import { IsEmail } from 'class-validator';
import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';

@Entity()
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
}
