import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

export const initializeDbTestBase = async (metadata: ModuleMetadata) => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: '.env.testing' }),
      PrismaModule,
      JwtModule.register({
        secret: 'my super secret key',
        signOptions: { expiresIn: '60s' },
      }),
    ],
    ...metadata,
  }).compile();

  return module;
};

export const refreshDatabase = async (prisma: PrismaService) => {
  await prisma.articleTag.deleteMany();
  await prisma.articleFavorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.followerUser.deleteMany();
  await prisma.user.deleteMany();
};

export const createUser = async (
  prisma: PrismaService,
  data: Partial<User> = {},
) => {
  return await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: await hash('password'),
      ...data,
    },
  });
};

export const actingAs = async (
  prisma: PrismaService,
  data: Partial<User> = {},
) => {
  return await createUser(prisma, data);
};
