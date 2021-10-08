import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import {
  initializeDbTestBase,
  actingAs,
  createUser,
  act,
} from '../db-test-base';
import { UserService } from './user.service';
import { UserDTO } from './dto/current-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UserService;
  let orm: MikroORM;
  let jwt: JwtService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [UserService],
    });

    service = await module.resolve(UserService);
    orm = module.get(MikroORM);
    jwt = module.get(JwtService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('can fetch user infos', async () => {
    await actingAs(orm, service);

    const user = await act<UserDTO>(orm, () => service.current());

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      username: 'John Doe',
    });

    const payload = jwt.decode(user.token);
    expect(payload['name']).toBe('John Doe');
    expect(payload['email']).toBe('john.doe@example.com');
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
    await actingAs(orm, service);

    const user = await act(orm, () =>
      service.update({
        email: 'jane.doe@example.com',
        bio: 'My Bio',
      }),
    );

    expect(user).toMatchObject({
      email: 'jane.doe@example.com',
      username: 'John Doe',
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
    await actingAs(orm, service);

    await expect(() =>
      act(orm, () =>
        service.update({
          email: 'jane.doe@example.com',
        }),
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
