import { Factory, Faker } from '@mikro-orm/seeder';
import { Comment } from './comment.entity';

export class CommentFactory extends Factory<Comment> {
  model = Comment;

  definition(faker: Faker): Partial<Comment> {
    return {
      body: faker.lorem.paragraphs(2),
      createdAt: faker.date.recent(7),
    };
  }
}
