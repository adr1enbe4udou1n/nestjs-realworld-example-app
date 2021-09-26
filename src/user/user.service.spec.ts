import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import {
  initializeDbTestBase,
  actingAs,
  createUser,
  act,
} from '../db-test-base';
import { UserService } from './user.service';
import { CurrentUserDTO } from './dto/current-user-dto';

describe('UsersService', () => {
  let service: UserService;
  let orm: MikroORM;
  let jwt: JwtService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [UserService],
    });

    service = module.get(UserService);
    orm = module.get(MikroORM);
    jwt = module.get(JwtService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('guest cannot fetch user infos', async () => {
    expect(() => service.current()).rejects.toThrow(UnauthorizedException);
  });

  it('guest cannot update infos', async () => {
    expect(() => service.current()).rejects.toThrow(UnauthorizedException);
  });

  it('can fetch user infos', async () => {
    await actingAs(orm, service);

    const user = await act<CurrentUserDTO>(orm, () => service.current());

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      username: 'John Doe',
    });

    const payload = jwt.decode(user.token);
    expect(payload['name']).toBe('John Doe');
    expect(payload['email']).toBe('john.doe@example.com');
  });

  it('can update own email', async () => {
    await actingAs(orm, service);

    const user = await act(orm, () =>
      service.update({
        email: 'jane.doe@example.com',
      }),
    );

    expect(user).toMatchObject({
      email: 'jane.doe@example.com',
      username: 'John Doe',
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
