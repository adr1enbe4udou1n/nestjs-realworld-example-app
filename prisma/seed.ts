import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { capitalize } from 'lodash';
import { UniqueEnforcer } from 'enforce-unique';

const prisma = new PrismaClient();

async function main() {
  await prisma.articleTag.deleteMany();
  await prisma.articleFavorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.followerUser.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash('password');

  await prisma.user.createMany({
    data: Array.from({ length: 50 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.paragraphs(3),
      image: faker.internet.avatar(),
      password,
    })),
  });

  const users = await prisma.user.findMany();

  for (const user of users) {
    const followers = faker.helpers.arrayElements(users, faker.number.int(5));
    for (const follower of followers) {
      await prisma.followerUser.create({
        data: {
          followerId: user.id,
          followingId: follower.id,
        },
      });
    }
  }

  const uniqueEnforcerWord = new UniqueEnforcer();

  await prisma.tag.createMany({
    data: Array.from({ length: 30 }, () => ({
      name: uniqueEnforcerWord.enforce(() => {
        return faker.lorem.word();
      }),
    })),
  });

  const uniqueEnforcerTitle = new UniqueEnforcer();

  await prisma.article.createMany({
    data: Array.from({ length: 500 }, () => {
      const title = capitalize(
        uniqueEnforcerTitle.enforce(() => {
          return faker.lorem.words(faker.number.int(5));
        }),
      );
      return {
        title,
        slug: title.toLowerCase().replace(/ /g, '-'),
        authorId: faker.helpers.arrayElement(users).id,
        description: faker.lorem.paragraph(),
        body: faker.lorem.paragraphs(5),
        createdAt: faker.date.recent({ days: 90 }),
      };
    }),
  });

  const articles = await prisma.article.findMany();

  for (const article of articles) {
    await prisma.comment.createMany({
      data: Array.from({ length: faker.number.int(10) }, () => ({
        body: faker.lorem.paragraphs(2),
        authorId: faker.helpers.arrayElement(users).id,
        articleId: article.id,
        createdAt: faker.date.recent({ days: 7 }),
      })),
    });

    const favoredUsers = faker.helpers.arrayElements(
      users,
      faker.number.int(5),
    );
    for (const favoredUser of favoredUsers) {
      await prisma.articleFavorite.create({
        data: {
          userId: favoredUser.id,
          articleId: article.id,
        },
      });
    }

    const tags = faker.helpers.arrayElements(
      await prisma.tag.findMany(),
      faker.number.int(3),
    );

    for (const tag of tags) {
      await prisma.articleTag.create({
        data: {
          articleId: article.id,
          tagId: tag.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
