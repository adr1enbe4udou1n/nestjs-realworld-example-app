import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { act, initializeDbTestBase } from '../db-test-base';
import { NewUserDTO } from './dto/register.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let orm: MikroORM;
  let service: UsersService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [UsersService],
    });

    service = await module.resolve(UsersService);
    orm = module.get(MikroORM);
  });

  afterEach(async () => {
    await orm.close(true);
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
    const user = await act<User>(orm, () =>
      service.register({
        email: 'john.doe@example.com',
        username: 'John Doe',
        password: 'password',
      }),
    );

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      name: 'John Doe',
    });

    const entity = await orm.em
      .getRepository(User)
      .findOne({ email: 'john.doe@example.com' });

    expect(entity).not.toBeNull();
  });

  it('cannot register twice', async () => {
    await orm.em.getRepository(User).persistAndFlush(
      new User({
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'password',
      }),
    );

    await expect(() =>
      act(orm, () =>
        service.register({
          email: 'john.doe@example.com',
          username: 'John Doe',
          password: 'password',
        }),
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
