import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import { plainToClass } from 'class-transformer';
import { UserDTO } from '../user/dto/current-user.dto';
import { act, initializeDbTestBase } from '../db-test-base';
import { NewUserDTO } from './dto/register.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let orm: MikroORM;
  let service: UsersService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [UsersService],
    });

    service = await module.resolve(UsersService);
    orm = module.get(MikroORM);
    jwt = module.get(JwtService);
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
    const user = await act<UserDTO>(orm, () =>
      service.register(
        plainToClass(NewUserDTO, {
          email: 'john.doe@example.com',
          username: 'John Doe',
          password: 'password',
        }),
      ),
    );

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      username: 'John Doe',
      bio: null,
      image: null,
    });

    const entity = await orm.em
      .getRepository(User)
      .findOne({ email: 'john.doe@example.com' });

    expect(entity).not.toBeNull();

    const payload = jwt.decode(user.token);
    expect(payload['id']).toBe(entity.id);
    expect(payload['name']).toBe('John Doe');
    expect(payload['email']).toBe('john.doe@example.com');
  });

  it('cannot register twice', async () => {
    await orm.em.getRepository(User).persistAndFlush(
      plainToClass(User, {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'password',
      }),
    );

    await expect(() =>
      act(orm, () =>
        service.register(
          plainToClass(NewUserDTO, {
            email: 'john.doe@example.com',
            username: 'John Doe',
            password: 'password',
          }),
        ),
      ),
    ).rejects.toThrow(BadRequestException);
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
      plainToClass(User, {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await hash('password'),
      }),
    );

    await expect(() => act(orm, () => service.login(data))).rejects.toThrow(
      BadRequestException,
    );
  });

  it('can login', async () => {
    await orm.em.getRepository(User).persistAndFlush(
      plainToClass(User, {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await hash('password'),
      }),
    );

    const user = await act(orm, () =>
      service.login({
        email: 'john.doe@example.com',
        password: 'password',
      }),
    );

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      username: 'John Doe',
      bio: null,
      image: null,
    });

    const payload = jwt.decode(user.token);
    expect(payload['name']).toBe('John Doe');
    expect(payload['email']).toBe('john.doe@example.com');
  });
});
