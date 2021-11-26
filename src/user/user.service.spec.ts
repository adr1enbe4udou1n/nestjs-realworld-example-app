import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { User } from '../users/user.entity';
import {
  initializeDbTestBase,
  actingAs,
  createUser,
  act,
} from '../db-test-base';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UserService;
  let orm: MikroORM;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [UserService],
    });

    service = await module.resolve(UserService);
    orm = module.get(MikroORM);
  });

  afterEach(async () => {
    await orm.close(true);
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
    const currentUser = await actingAs(orm);

    const user = await act(orm, () =>
      service.update(
        {
          email: 'jane.doe@example.com',
          bio: 'My Bio',
        },
        currentUser,
      ),
    );

    expect(user).toMatchObject({
      email: 'jane.doe@example.com',
      name: 'John Doe',
      bio: 'My Bio',
    });

    const entity = await orm.em
      .getRepository(User)
      .findOne({ email: 'jane.doe@example.com' });

    expect(entity).not.toBeNull();
  });

  it('cannot update with already used email', async () => {
    await createUser(orm, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    const currentUser = await actingAs(orm);

    await expect(() =>
      act(orm, () =>
        service.update(
          {
            email: 'jane.doe@example.com',
          },
          currentUser,
        ),
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
