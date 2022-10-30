import { Factory, Faker } from '@mikro-orm/seeder';
import { Tag } from './tag.entity';

export class TagFactory extends Factory<Tag> {
  model = Tag;

  definition(faker: Faker): Partial<Tag> {
    return {
      name: faker.helpers.unique(faker.lorem.word),
    };
  }
}
