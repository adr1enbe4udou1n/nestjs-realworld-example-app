import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { InitializeDbTestBase } from '../db-test-base';
import { RegisterDTO } from './dto/register-dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let orm: MikroORM;
  let jwt: JwtService;

  beforeEach(async () => {
    const module = await InitializeDbTestBase({
      controllers: [UsersController],
      providers: [UsersService],
    });

    controller = module.get(UsersController);
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
  ])('should not register with invalid data', async (data) => {
    await expect(() =>
      new ValidationPipe().transform(data, {
        type: 'body',
        metatype: RegisterDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should register new users', async () => {
    const data = await controller.register({
      user: plainToClass(RegisterDTO, {
        email: 'john.doe@example.com',
        username: 'John Doe',
        password: 'password',
      }),
    });

    expect(data).toMatchObject({
      user: {
        email: 'john.doe@example.com',
        username: 'John Doe',
        bio: null,
        image: null,
      },
    });

    const user = await orm.em
      .getRepository(User)
      .findOne({ email: 'john.doe@example.com' });

    expect(user).not.toBeNull();

    const payload = jwt.decode(data.user.token);
    expect(payload['id']).toBe(user.id);
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
      controller.register({
        user: plainToClass(RegisterDTO, {
          email: 'john.doe@example.com',
          username: 'John Doe',
          password: 'password',
        }),
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
