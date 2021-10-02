import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Tag } from '../tags/tag.entity';
import { UserService } from '../user/user.service';
import { act, actingAs, initializeDbTestBase } from '../db-test-base';
import { ArticlesService } from './articles.service';
import { NewArticleDTO } from './dto/article-create.dto';
import { Article } from './article.entity';

describe('ArticlesService', () => {
  let orm: MikroORM;
  let service: ArticlesService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [ArticlesService, UserService],
    });

    orm = module.get(MikroORM);
    service = module.get(ArticlesService);
    userService = module.get(UserService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  /**
   * Article List
   */

  it('can paginate articles', () => {
    expect(service).toBeDefined();
  });

  it('can filter articles by author', () => {
    expect(service).toBeDefined();
  });

  it('can filter articles by favorited', () => {
    expect(service).toBeDefined();
  });

  it('can filter articles by tag', () => {
    expect(service).toBeDefined();
  });

  /**
   * Article Feed
   */

  it('can paginate articles of followed authors', () => {
    expect(service).toBeDefined();
  });

  /**
   * Article Get
   */

  it('can get article', () => {
    expect(service).toBeDefined();
  });

  it('cannot get non existent article', () => {
    expect(service).toBeDefined();
  });

  /**
   * Article Create
   */

  it('can create article', async () => {
    await actingAs(orm, userService, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await orm.em
      .getRepository(Tag)
      .persistAndFlush(plainToClass(Tag, { name: 'Existing Tag' }));

    const article = await act(orm, () =>
      service.create(
        plainToClass(NewArticleDTO, {
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagList: ['Test Tag 1', 'Test Tag 2', 'Existing Tag'],
        }),
      ),
    );

    expect(article).toMatchObject({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      author: {
        username: 'John Doe',
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      },
      tagList: ['Test Tag 1', 'Test Tag 2', 'Existing Tag'],
    });

    await expect(await orm.em.getRepository(Article).count()).resolves.toBe(1);
    await expect(await orm.em.getRepository(Tag).count()).resolves.toBe(3);
  });

  it.each([
    {
      title: '',
      description: 'Test Description',
      body: 'Test Body',
    },
    {
      title: 'Test Title',
      description: '',
      body: 'Test Body',
    },
    {
      title: 'Test Title',
      description: 'Test Description',
      body: '',
    },
  ])('cannot create article with invalid data', async (data) => {
    await expect(() =>
      new ValidationPipe().transform(data, {
        type: 'body',
        metatype: NewArticleDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  // it('cannot create article with same title', async (data) => {
  // await expect(() =>
  //   new ValidationPipe().transform(data, {
  //     type: 'body',
  //     metatype: NewArticleDTO,
  //   }),
  // ).rejects.toThrow(BadRequestException);
  // });

  /**
   * Article Update
   */

  it('can update own article', () => {
    expect(service).toBeDefined();
  });

  it('cannot update article with invalid data', () => {
    expect(service).toBeDefined();
  });

  it('cannot update non existent article', () => {
    expect(service).toBeDefined();
  });

  it('cannot update article of other author', () => {
    expect(service).toBeDefined();
  });

  /**
   * Article Delete
   */

  it('can delete own article with all comments', () => {
    expect(service).toBeDefined();
  });

  it('cannot delete article of other author', () => {
    expect(service).toBeDefined();
  });

  it('cannot delete non existent article', () => {
    expect(service).toBeDefined();
  });

  /**
   * Article Favorite
   */

  it('can favorite article', () => {
    expect(service).toBeDefined();
  });

  it('can unfavorite article', () => {
    expect(service).toBeDefined();
  });

  it('cannot favorite non existent article', () => {
    expect(service).toBeDefined();
  });
});
