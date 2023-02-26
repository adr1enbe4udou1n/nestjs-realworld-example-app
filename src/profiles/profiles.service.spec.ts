import { MikroORM, NotFoundError } from '@mikro-orm/core';
import { User } from '../users/user.entity';
import {
  act,
  actingAs,
  createUser,
  initializeDbTestBase,
  refreshDatabase,
} from '../db-test-base';
import { ProfilesService } from './profiles.service';
import { hash } from 'argon2';
import { UserService } from '../user/user.service';

describe('ProfilesService', () => {
  let orm: MikroORM;
  let service: ProfilesService;

  beforeAll(async () => {
    const module = await initializeDbTestBase({
      providers: [ProfilesService, UserService],
    });

    service = await module.resolve(ProfilesService);
    orm = module.get(MikroORM);
  });

  beforeEach(async () => {
    await refreshDatabase(orm);
  });

  afterAll(async () => {
    await orm.close();
  });

  it('can get profile', async () => {
    await orm.em.getRepository(User).persistAndFlush(
      new User({
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

  it('cannot get non existent profile', async () => {
    await expect(() => act(orm, () => service.get('John Doe'))).rejects.toThrow(
      NotFoundError,
    );
  });

  it('can get followed profile', async () => {
    const user = await actingAs(orm, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    user.following.add(
      new User({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: await hash('password'),
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      }),
    );
    await orm.em.flush();

    const data = await act(orm, () => service.get('Jane Doe', user));

    expect(data).toMatchObject({
      username: 'Jane Doe',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
      following: true,
    });
  });

  it('can follow profile', async () => {
    const user = await actingAs(orm, {
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

    await act(orm, () => service.follow('Jane Doe', true, user));
    const data = await act(orm, () => service.follow('Jane Doe', true, user));

    expect(data).toMatchObject({
      username: 'Jane Doe',
      following: true,
    });

    expect(
      (
        await orm.em
          .getRepository(User)
          .findOne({ name: 'Jane Doe' }, { populate: ['followers'] })
      )?.followers.count(),
    ).toBe(1);
  });

  it('can unfollow profile', async () => {
    const user = await actingAs(orm, {
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    user.following.add(
      new User({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: await hash('password'),
      }),
      new User({
        name: 'Alice',
        email: 'alice@example.com',
        password: await hash('password'),
      }),
    );
    await orm.em.flush();

    const data = await act(orm, () => service.follow('Jane Doe', false, user));

    expect(data).toMatchObject({
      username: 'Jane Doe',
      following: false,
    });

    expect(
      (
        await orm.em
          .getRepository(User)
          .findOne({ name: 'Alice' }, { populate: ['followers'] })
      )?.followers.count(),
    ).toBe(1);
  });
});
