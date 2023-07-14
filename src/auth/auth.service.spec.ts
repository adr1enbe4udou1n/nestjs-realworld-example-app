import { JwtService } from '@nestjs/jwt';
import {
  initializeDbTestBase,
  actingAs,
  refreshDatabase,
} from '../db-test-base';
import { AuthService } from './auth.service';
import { hash } from 'argon2';
import { PrismaClient } from '@prisma/client';

describe('UsersService', () => {
  let service: AuthService;
  let prisma: PrismaClient;
  let jwt: JwtService;

  beforeAll(async () => {
    const module = await initializeDbTestBase({
      providers: [AuthService],
    });

    service = await module.resolve(AuthService);
    prisma = module.get(PrismaClient);
    jwt = module.get(JwtService);
  });

  beforeEach(async () => {
    await refreshDatabase(prisma);
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
    await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await hash('password'),
      },
    });

    const user = await service.validateUser(data.email, data.password);
    expect(user).toBeNull();
  });

  it('can login', async () => {
    await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await hash('password'),
      },
    });

    const user = await service.validateUser('john.doe@example.com', 'password');
    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      name: 'John Doe',
      bio: null,
      image: null,
    });
  });

  it('can fetch user infos', async () => {
    const currentUser = await actingAs(prisma);

    const user = await service.getUserWithToken(currentUser);
    expect(user).toMatchObject({
      email: 'john.doe@example.com',
      username: 'John Doe',
    });

    const payload = jwt.decode(user.token);
    expect(payload!['username']).toBe('John Doe');
  });
});
