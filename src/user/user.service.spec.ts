import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  initializeDbTestBase,
  actingAs,
  createUser,
  refreshDatabase,
} from '../db-test-base';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await initializeDbTestBase({
      providers: [UserService],
    });

    service = await module.resolve(UserService);
    prisma = module.get(PrismaService);
  });

  beforeEach(async () => {
    await refreshDatabase(prisma);
  });

  it.each([
    {
      username: 'John Doe',
      email: 'john.doe',
      bio: 'My Bio',
    },
    {
      username: '',
      email: 'john.doe@example.com',
      bio: 'My Bio',
    },
  ])('cannot update infos with invalid data', async (data) => {
    await expect(() =>
      new ValidationPipe().transform(data, {
        type: 'body',
        metatype: UpdateUserDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('can update infos', async () => {
    const currentUser = await actingAs(prisma);

    const user = await service.update(
      {
        email: 'jane.doe@example.com',
        bio: 'My Bio',
      },
      currentUser,
    );
    expect(user).toMatchObject({
      email: 'jane.doe@example.com',
      name: 'John Doe',
      bio: 'My Bio',
    });

    const entity = await prisma.em
      .getRepository(User)
      .findOne({ email: 'jane.doe@example.com' });

    expect(entity).not.toBeNull();
  });

  it('cannot update with already used email', async () => {
    await createUser(prisma, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    const currentUser = await actingAs(prisma);

    await expect(() =>
      service.update(
        {
          email: 'jane.doe@example.com',
        },
        currentUser,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
