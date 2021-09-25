import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { User } from '../users/user.entity';
import { InitializeDbTestBase } from '../db-test-base';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { hash } from 'argon2';

describe('UsersController', () => {
  let controller: UserController;
  let service: UserService;
  let orm: MikroORM;
  let jwt: JwtService;

  beforeEach(async () => {
    const module = await InitializeDbTestBase({
      controllers: [UserController],
      providers: [UserService],
    });

    controller = module.get(UserController);
    service = module.get(UserService);
    orm = module.get(MikroORM);
    jwt = module.get(JwtService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('should not fetch user infos when anonymous', async () => {
    await expect(() => controller.current()).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should fetch user infos when logged', async () => {
    const user = plainToClass(User, {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: await hash('password'),
    });

    await orm.em.getRepository(User).persistAndFlush(user);
    service.user = user;

    const data = await controller.current();

    expect(data).toMatchObject({
      user: {
        email: 'john.doe@example.com',
        username: 'John Doe',
        bio: null,
        image: null,
      },
    });

    const payload = jwt.decode(data.user.token);
    expect(payload['name']).toBe('John Doe');
    expect(payload['email']).toBe('john.doe@example.com');
  });
});
