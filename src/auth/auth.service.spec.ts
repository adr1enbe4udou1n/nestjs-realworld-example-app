import { MikroORM } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { initializeDbTestBase, actingAs, act } from '../db-test-base';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/dto/current-user.dto';
import { User } from '../users/user.entity';
import { hash } from 'argon2';

describe('UsersService', () => {
  let service: AuthService;
  let orm: MikroORM;
  let jwt: JwtService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [AuthService],
    });

    service = await module.resolve(AuthService);
    orm = module.get(MikroORM);
    jwt = module.get(JwtService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it.each([
    {
      email: 'jane.doe@example.com',
      password: 'password',
    },
    {
      email: 'john.doe@example.com',
      password: 'badpassword',
    },
  ])('cannot login with invalid data', async (data) => {
    await orm.em.getRepository(User).persistAndFlush(
      new User({
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await hash('password'),
      }),
    );

    const user = await act(orm, () =>
      service.validateUser(data.email, data.password),
    );

    expect(user).toBeNull();
  });

  it('can login', async () => {
    await orm.em.getRepository(User).persistAndFlush(
      new User({
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await hash('password'),
      }),
    );

    const user = await act(orm, () =>
      service.validateUser('john.doe@example.com', 'password'),
    );

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      name: 'John Doe',
      bio: null,
      image: null,
    });
  });

  it('can fetch user infos', async () => {
    const currentUser = await actingAs(orm);

    const user = await act<UserDTO>(orm, () =>
      service.getUserWithToken(currentUser),
    );

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      username: 'John Doe',
    });

    const payload = jwt.decode(user.token);
    expect(payload!['username']).toBe('John Doe');
  });
});
