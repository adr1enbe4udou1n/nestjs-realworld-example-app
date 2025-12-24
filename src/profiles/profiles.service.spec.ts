import {
  actingAs,
  createUser,
  initializeDbTestBase,
  refreshDatabase,
} from '../db-test-base';
import { ProfilesService } from './profiles.service';
import { hash } from 'argon2';
import { UserService } from '../user/user.service';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfilesService', () => {
  let prisma: PrismaService;
  let service: ProfilesService;

  beforeAll(async () => {
    const module = await initializeDbTestBase({
      providers: [ProfilesService, UserService],
    });

    service = await module.resolve(ProfilesService);
    prisma = module.get(PrismaService);
  });

  beforeEach(async () => {
    await refreshDatabase(prisma);
  });

  it('can get profile', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await hash('password'),
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      },
    });

    const data = await service.get('John Doe');

    expect(data).toMatchObject({
      username: 'John Doe',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
      following: false,
    });
  });

  it('cannot get non existent profile', async () => {
    await expect(() => service.get('John Doe')).rejects.toThrow(
      Prisma.PrismaClientKnownRequestError,
    );
  });

  it('can get followed profile', async () => {
    const user = await actingAs(prisma, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        followers: {
          create: {
            following: {
              create: {
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                password: await hash('password'),
                bio: 'My Bio',
                image: 'https://i.pravatar.cc/300',
              },
            },
          },
        },
      },
    });

    const data = await service.get('Jane Doe', user);

    expect(data).toMatchObject({
      username: 'Jane Doe',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
      following: true,
    });
  });

  it('can follow profile', async () => {
    const user = await actingAs(prisma, {
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    await createUser(prisma, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    await createUser(prisma, {
      name: 'Alice',
      email: 'alice@example.com',
    });

    const data = await service.follow('Jane Doe', true, user);
    await service.follow('Jane Doe', true, user);
    expect(data).toMatchObject({
      username: 'Jane Doe',
      following: true,
    });

    expect(
      (
        await prisma.user.findUnique({
          where: { name: 'Jane Doe' },
          include: { following: true },
        })
      )?.following.length,
    ).toBe(1);
  });

  it('can unfollow profile', async () => {
    const user = await actingAs(prisma, {
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        followers: {
          create: [
            {
              following: {
                create: {
                  name: 'Jane Doe',
                  email: 'jane.doe@example.com',
                  password: await hash('password'),
                },
              },
            },
            {
              following: {
                create: {
                  name: 'Alice',
                  email: 'alice@example.com',
                  password: await hash('password'),
                },
              },
            },
          ],
        },
      },
    });

    const data = await service.follow('Jane Doe', false, user);
    expect(data).toMatchObject({
      username: 'Jane Doe',
      following: false,
    });

    expect(
      (
        await prisma.user.findUnique({
          where: { name: 'Alice' },
          include: { following: true },
        })
      )?.following.length,
    ).toBe(1);
  });
});
