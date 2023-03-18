import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { initializeDbTestBase, refreshDatabase } from '../db-test-base';
import { PrismaService } from '../prisma/prisma.service';
import { NewUserDTO } from './dto/register.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let prisma: PrismaService;
  let service: UsersService;

  beforeAll(async () => {
    const module = await initializeDbTestBase({
      providers: [UsersService],
    });

    service = await module.resolve(UsersService);
    prisma = module.get(PrismaService);
  });

  beforeEach(async () => {
    await refreshDatabase(prisma);
  });

  it.each([
    {
      email: 'john.doe',
      username: 'John Doe',
      password: 'password',
    },
    {
      email: 'john.doe@example.com',
    },
    {
      email: 'john.doe@example.com',
      username: 'John Doe',
      password: 'pass',
    },
  ])('cannot register with invalid data', async (data) => {
    await expect(() =>
      new ValidationPipe().transform(data, {
        type: 'body',
        metatype: NewUserDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('can register new users', async () => {
    const user = await service.register({
      email: 'john.doe@example.com',
      username: 'John Doe',
      password: 'password',
    });
    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      name: 'John Doe',
    });

    const entity = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(entity).not.toBeNull();
  });

  it('cannot register twice', async () => {
    await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'password',
      },
    });

    await expect(() =>
      service.register({
        email: 'john.doe@example.com',
        username: 'John Doe',
        password: 'password',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
