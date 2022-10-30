import { Factory, Faker } from '@mikro-orm/seeder';
import { User } from './user.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.paragraphs(3),
      image: faker.internet.avatar(),
    };
  }
}
