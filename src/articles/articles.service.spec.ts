import { MikroORM, NotFoundError } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Tag } from '../tags/tag.entity';
import { UserService } from '../user/user.service';
import { act, actingAs, initializeDbTestBase } from '../db-test-base';
import { ArticlesService } from './articles.service';
import { NewArticleDTO } from './dto/article-create.dto';
import { Article } from './article.entity';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { CommentsService } from './comments/comments.service';
import { NewCommentDTO } from './comments/dto/comment-create.dto';
import { Comment } from './comments/comment.entity';

describe('ArticlesService', () => {
  let orm: MikroORM;
  let service: ArticlesService;
  let commentsService: CommentsService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [ArticlesService, CommentsService, UserService],
    });

    orm = module.get(MikroORM);
    service = module.get(ArticlesService);
    commentsService = module.get(CommentsService);
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

  it('can get article', async () => {
    await actingAs(orm, userService, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await service.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['Test Tag 1', 'Test Tag 2'],
      }),
    );

    const article = await act(orm, () => service.get('test-article'));

    expect(article).toMatchObject({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      slug: 'test-article',
      author: {
        username: 'John Doe',
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      },
      tagList: ['Test Tag 1', 'Test Tag 2'],
    });
  });

  it('cannot get non existent article', async () => {
    await expect(() =>
      act(orm, () => service.get('test-article')),
    ).rejects.toThrow(NotFoundError);
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
      slug: 'test-article',
      author: {
        username: 'John Doe',
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      },
      tagList: ['Test Tag 1', 'Test Tag 2', 'Existing Tag'],
    });

    expect(await orm.em.getRepository(Article).count()).toBe(1);
    expect(await orm.em.getRepository(Tag).count()).toBe(3);
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

  it('cannot create article with same title', async () => {
    await actingAs(orm, userService, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await service.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    await expect(() =>
      act(orm, () =>
        service.create(
          plainToClass(NewArticleDTO, {
            title: 'Test Article',
            description: 'Test Description',
            body: 'Test Body',
          }),
        ),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  /**
   * Article Update
   */

  it('can update own article', async () => {
    await actingAs(orm, userService);

    await service.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    const article = await act(orm, () =>
      service.update(
        'test-article',
        plainToClass(UpdateArticleDTO, {
          title: 'New Title',
          description: 'New Description',
          body: 'New Body',
        }),
      ),
    );

    expect(article).toMatchObject({
      title: 'New Title',
      description: 'New Description',
      body: 'New Body',
      slug: 'test-article',
      author: {
        username: 'John Doe',
      },
      tagList: [],
    });

    expect(
      await orm.em.getRepository(Article).count({ title: 'New Title' }),
    ).toBe(1);
  });

  it.each([
    {
      title: 'New Title',
      description: 'New Description',
      body: '',
    },
  ])('cannot update article with invalid data', async (data) => {
    await expect(() =>
      new ValidationPipe().transform(data, {
        type: 'body',
        metatype: UpdateArticleDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('cannot update non existent article', async () => {
    await expect(() =>
      act(orm, () =>
        service.update(
          'test-article',
          plainToClass(UpdateArticleDTO, {
            title: 'New Title',
            description: 'New Description',
            body: 'New Body',
          }),
        ),
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('cannot update article of other author', async () => {
    await actingAs(orm, userService);

    await service.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    await actingAs(orm, userService, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    await expect(() =>
      act(orm, () =>
        service.update(
          'test-article',
          plainToClass(UpdateArticleDTO, {
            title: 'New Title',
            description: 'New Description',
            body: 'New Body',
          }),
        ),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  /**
   * Article Delete
   */

  it('can delete own article with all comments', async () => {
    await actingAs(orm, userService);

    await service.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    await commentsService.create(
      'test-article',
      plainToClass(NewCommentDTO, {
        body: 'New Comment 1',
      }),
    );

    await commentsService.create(
      'test-article',
      plainToClass(NewCommentDTO, {
        body: 'New Comment 2',
      }),
    );

    await act(orm, () => service.delete('test-article'));

    expect(await orm.em.getRepository(Article).count()).toBe(0);
    expect(await orm.em.getRepository(Comment).count()).toBe(0);
  });

  it('cannot delete article of other author', async () => {
    await actingAs(orm, userService);

    await service.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    await actingAs(orm, userService, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    await expect(() =>
      act(orm, () => service.delete('test-article')),
    ).rejects.toThrow(BadRequestException);
  });

  it('cannot delete non existent article', async () => {
    await expect(() =>
      act(orm, () => service.delete('test-article')),
    ).rejects.toThrow(NotFoundError);
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
