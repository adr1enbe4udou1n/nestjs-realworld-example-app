import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { initializeDbTestBase, actingAs } from '../db-test-base';
import { UserService } from './user.service';

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

  it('should not fetch user infos when anonymous', async () => {
    expect(() => service.current()).toThrow(UnauthorizedException);
  });

  it('should fetch user infos when logged', async () => {
    await actingAs(orm, service);

    const user = service.current();

    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      username: 'John Doe',
    });

    const payload = jwt.decode(user.token);
    expect(payload['name']).toBe('John Doe');
    expect(payload['email']).toBe('john.doe@example.com');
  });

  it('should update own email when logged', async () => {
    await actingAs(orm, service);

    const user = await service.update({
      email: 'jane.doe@example.com',
    });

    expect(user).toMatchObject({
      email: 'jane.doe@example.com',
      username: 'John Doe',
    });
  });
});
