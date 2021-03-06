import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'argon2';
import { Article } from './articles/article.entity';
import { Comment } from './articles/comments/comment.entity';
import { Tag } from './tags/tag.entity';
import { User } from './users/user.entity';

export const initializeDbTestBase = async (metadata: ModuleMetadata) => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: '.env.testing' }),
      MikroOrmModule.forRoot(),
      MikroOrmModule.forFeature([User, Tag, Article, Comment]),
      JwtModule.register({
        secret: 'my super secret key',
        signOptions: { expiresIn: '60s' },
      }),
    ],
    ...metadata,
  }).compile();

  const orm = module.get<MikroORM>(MikroORM);

  await orm.getMigrator().up();

  await orm.em.nativeDelete(Tag, {});
  await orm.em.nativeDelete(Comment, {});
  await orm.em.nativeDelete(Article, {});
  await orm.em.nativeDelete(User, {});

  orm.config.set('allowGlobalContext', true);

  return module;
};

export const createUser = async (orm: MikroORM, data: Partial<User> = {}) => {
  const user = new User({
    email: 'john.doe@example.com',
    name: 'John Doe',
    password: await hash('password'),
    ...data,
  });

  await orm.em.getRepository(User).persistAndFlush(user);

  return user;
};

export const actingAs = async (orm: MikroORM, data: Partial<User> = {}) => {
  return await createUser(orm, data);
};

export const act = async <T>(orm: MikroORM, action: () => Promise<T>) => {
  orm.em.clear();

  return await action();
};
