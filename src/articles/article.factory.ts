import { Factory, Faker } from '@mikro-orm/seeder';
import { Article } from './article.entity';
import { capitalize } from 'lodash';

export class ArticleFactory extends Factory<Article> {
  model = Article;

  definition(faker: Faker): Partial<Article> {
    return {
      title: capitalize(
        faker.unique(() => faker.lorem.words(faker.datatype.number(5))),
      ),
      description: faker.lorem.paragraph(),
      body: faker.lorem.paragraphs(5),
      createdAt: faker.date.recent(90),
    };
  }
}
