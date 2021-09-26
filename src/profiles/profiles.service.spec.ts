import { MikroORM, NotFoundError } from '@mikro-orm/core';
import { plainToClass } from 'class-transformer';
import { User } from '../users/user.entity';
import {
  act,
  actingAs,
  createUser,
  initializeDbTestBase,
} from '../db-test-base';
import { ProfilesService } from './profiles.service';
import { hash } from 'argon2';
import { UserService } from '../user/user.service';

describe('ProfilesService', () => {
  let orm: MikroORM;
  let service: ProfilesService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [ProfilesService, UserService],
    });

    service = module.get(ProfilesService);
    userService = module.get(UserService);
    orm = module.get(MikroORM);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('can get profile', async () => {
    await orm.em.getRepository(User).persistAndFlush(
      plainToClass(User, {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await hash('password'),
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      }),
    );

    const data = await act(orm, () => service.get('John Doe'));

    expect(data).toMatchObject({
      username: 'John Doe',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
      following: false,
    });
  });

  it('cannot get not existing profile', () => {
    expect(() => act(orm, () => service.get('John Doe'))).rejects.toThrow(
      NotFoundError,
    );
  });

  it('can get followed profile', async () => {
    const user = await actingAs(orm, userService, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    user.following.add(
      plainToClass(User, {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: await hash('password'),
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      }),
    );
    await orm.em.flush();

    const data = await act(orm, () => service.get('Jane Doe'));

    expect(data).toMatchObject({
      username: 'Jane Doe',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
      following: true,
    });
  });

  it('can follow profile', async () => {
    await actingAs(orm, userService, {
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    await createUser(orm, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    await createUser(orm, {
      name: 'Alice',
      email: 'alice@example.com',
    });

    await act(orm, () => service.follow('Jane Doe', true));
    const data = await act(orm, () => service.follow('Jane Doe', true));

    expect(data).toMatchObject({
      username: 'Jane Doe',
      following: true,
    });

    expect(
      (
        await orm.em
          .getRepository(User)
          .findOne({ name: 'Jane Doe' }, ['followers'])
      ).followers.count(),
    ).toBe(1);
  });

  it('can unfollow profile', async () => {
    const user = await actingAs(orm, userService, {
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    user.following.add(
      plainToClass(User, {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: await hash('password'),
      }),
      plainToClass(User, {
        name: 'Alice',
        email: 'alice@example.com',
        password: await hash('password'),
      }),
    );
    await orm.em.flush();

    const data = await act(orm, () => service.follow('Jane Doe', false));

    expect(data).toMatchObject({
      username: 'Jane Doe',
      following: false,
    });

    expect(
      (
        await orm.em
          .getRepository(User)
          .findOne({ name: 'Alice' }, ['followers'])
      ).followers.count(),
    ).toBe(1);
  });
});
