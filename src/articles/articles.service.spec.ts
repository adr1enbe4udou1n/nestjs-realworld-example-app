import { MikroORM, NotFoundError } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Tag } from '../tags/tag.entity';
import { UserService } from '../user/user.service';
import { act, actingAs, initializeDbTestBase } from '../db-test-base';
import { ArticlesService } from './articles.service';
import { NewArticleDTO } from './dto/article-create.dto';
import { Article } from './article.entity';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { CommentsService } from './comments/comments.service';
import { Comment } from './comments/comment.entity';
import { User } from '../users/user.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { ContextIdFactory } from '@nestjs/core';

describe('ArticlesService', () => {
  let orm: MikroORM;
  let service: ArticlesService;
  let commentsService: CommentsService;
  let userService: UserService;
  let profilesService: ProfilesService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [
        ArticlesService,
        CommentsService,
        UserService,
        ProfilesService,
      ],
    });

    orm = module.get(MikroORM);

    const contextId = ContextIdFactory.create();
    commentsService = await module.resolve(CommentsService, contextId);
    userService = await module.resolve(UserService, contextId);
    profilesService = await module.resolve(ProfilesService, contextId);
    service = await module.resolve(ArticlesService, contextId);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  const createArticlesForAuthor = async (
    user: Partial<User>,
    count: number,
  ) => {
    await actingAs(orm, userService, user);

    for (let i = 1; i <= count; i++) {
      await service.create({
        title: `${user.name} - Test Article ${i}`,
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['Test Tag 1', 'Test Tag 2', `Tag ${user.name}`],
      });
    }
  };

  const createArticles = async () => {
    await createArticlesForAuthor(
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      30,
    );

    await createArticlesForAuthor(
      {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
      20,
    );
  };

  /**
   * Article List
   */

  it('can paginate articles', async () => {
    await createArticles();

    const [items, count] = await act(orm, () =>
      service.list({ limit: 30, offset: 10 }),
    );

    expect(items.length).toBe(20);
    expect(count).toBe(50);

    expect(items[0]).toMatchObject({
      title: 'Jane Doe - Test Article 10',
      description: 'Test Description',
      body: 'Test Body',
      author: {
        username: 'Jane Doe',
      },
      tagList: ['Tag Jane Doe', 'Test Tag 1', 'Test Tag 2'],
    });
  });

  it('can filter articles by author', async () => {
    await createArticles();

    const [items, count] = await act(orm, () =>
      service.list({
        limit: 10,
        offset: 0,
        author: 'John',
      }),
    );

    expect(items.length).toBe(10);
    expect(count).toBe(30);

    expect(items[0]).toMatchObject({
      title: 'John Doe - Test Article 30',
      description: 'Test Description',
      body: 'Test Body',
      author: {
        username: 'John Doe',
      },
      tagList: ['Tag John Doe', 'Test Tag 1', 'Test Tag 2'],
    });
  });

  it('can filter articles by tag', async () => {
    await createArticles();

    const [items, count] = await act(orm, () =>
      service.list({
        limit: 10,
        offset: 0,
        tag: 'Tag Jane Doe',
      }),
    );

    expect(items.length).toBe(10);
    expect(count).toBe(20);

    expect(items[0]).toMatchObject({
      title: 'Jane Doe - Test Article 20',
      description: 'Test Description',
      body: 'Test Body',
      author: {
        username: 'Jane Doe',
      },
      tagList: ['Tag Jane Doe', 'Test Tag 1', 'Test Tag 2'],
    });
  });

  it('can filter articles by favorited', async () => {
    await createArticles();

    for (const slug of [
      'john-doe-test-article-1',
      'john-doe-test-article-2',
      'john-doe-test-article-4',
      'john-doe-test-article-8',
      'john-doe-test-article-16',
    ]) {
      await service.favorite(slug, true);
    }

    const [items, count] = await act(orm, () =>
      service.list({
        limit: 10,
        offset: 0,
        favorited: 'Jane',
      }),
    );

    expect(items.length).toBe(5);
    expect(count).toBe(5);

    expect(items[0]).toMatchObject({
      title: 'John Doe - Test Article 16',
      description: 'Test Description',
      body: 'Test Body',
      author: {
        username: 'John Doe',
      },
      tagList: ['Tag John Doe', 'Test Tag 1', 'Test Tag 2'],
      favorited: true,
      favoritesCount: 1,
    });
  });

  /**
   * Article Feed
   */

  it('can paginate articles of followed authors', async () => {
    await createArticles();

    await profilesService.follow('John Doe', true);

    const [items, count] = await act(orm, () =>
      service.feed({
        limit: 10,
        offset: 0,
      }),
    );

    expect(items.length).toBe(10);
    expect(count).toBe(30);

    expect(items[0]).toMatchObject({
      title: 'John Doe - Test Article 30',
      description: 'Test Description',
      body: 'Test Body',
      author: {
        username: 'John Doe',
      },
      tagList: ['Tag John Doe', 'Test Tag 1', 'Test Tag 2'],
    });

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

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: ['Test Tag 1', 'Test Tag 2'],
    });

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
      .persistAndFlush(new Tag({ name: 'Existing Tag' }));

    const article = await act(orm, () =>
      service.create({
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['Existing Tag', 'Test Tag 1', 'Test Tag 2'],
      }),
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
      tagList: ['Existing Tag', 'Test Tag 1', 'Test Tag 2'],
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

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: [],
    });

    await expect(() =>
      act(orm, () =>
        service.create({
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagList: [],
        }),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  /**
   * Article Update
   */

  it('can update own article', async () => {
    await actingAs(orm, userService);

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: [],
    });

    const article = await act(orm, () =>
      service.update('test-article', {
        title: 'New Title',
        description: 'New Description',
        body: 'New Body',
      }),
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
        service.update('test-article', {
          title: 'New Title',
          description: 'New Description',
          body: 'New Body',
        }),
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('cannot update article of other author', async () => {
    await actingAs(orm, userService);

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: [],
    });

    await actingAs(orm, userService, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    await expect(() =>
      act(orm, () =>
        service.update('test-article', {
          title: 'New Title',
          description: 'New Description',
          body: 'New Body',
        }),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  /**
   * Article Delete
   */

  it('can delete own article with all comments', async () => {
    await actingAs(orm, userService);

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: [],
    });

    await commentsService.create('test-article', {
      body: 'New Comment 1',
    });

    await commentsService.create('test-article', {
      body: 'New Comment 2',
    });

    await act(orm, () => service.delete('test-article'));

    expect(await orm.em.getRepository(Article).count()).toBe(0);
    expect(await orm.em.getRepository(Comment).count()).toBe(0);
  });

  it('cannot delete article of other author', async () => {
    await actingAs(orm, userService);

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: [],
    });

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

  it('can favorite article', async () => {
    await actingAs(orm, userService);

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: [],
    });

    const article = await act(orm, () =>
      service.favorite('test-article', true),
    );

    expect(article).toMatchObject({
      favorited: true,
      favoritesCount: 1,
    });
  });

  it('can unfavorite article', async () => {
    await actingAs(orm, userService);

    await service.create({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: [],
    });

    await service.favorite('test-article', true);

    const article = await act(orm, () =>
      service.favorite('test-article', false),
    );

    expect(article).toMatchObject({
      favorited: false,
      favoritesCount: 0,
    });
  });

  it('cannot favorite non existent article', async () => {
    await expect(() =>
      act(orm, () => service.favorite('test-article', true)),
    ).rejects.toThrow(NotFoundError);
  });
});
