import { MikroORM, NotFoundError } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Tag } from '../tags/tag.entity';
import { act, actingAs, initializeDbTestBase } from '../db-test-base';
import { ArticlesService } from './articles.service';
import { NewArticleDTO } from './dto/article-create.dto';
import { Article } from './article.entity';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { CommentsService } from './comments/comments.service';
import { Comment } from './comments/comment.entity';
import { User } from '../users/user.entity';
import { ProfilesService } from '../profiles/profiles.service';

describe('ArticlesService', () => {
  let orm: MikroORM;
  let service: ArticlesService;
  let commentsService: CommentsService;
  let profilesService: ProfilesService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [ArticlesService, CommentsService, ProfilesService],
    });

    orm = module.get(MikroORM);

    commentsService = await module.resolve(CommentsService);
    profilesService = await module.resolve(ProfilesService);
    service = await module.resolve(ArticlesService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  const createArticlesForAuthor = async (
    user: Partial<User>,
    count: number,
  ) => {
    const currentUser = await actingAs(orm, user);

    for (let i = 1; i <= count; i++) {
      await service.create(
        {
          title: `${user.name} - Test Article ${i}`,
          description: 'Test Description',
          body: 'Test Body',
          tagList: ['Test Tag 1', 'Test Tag 2', `Tag ${user.name}`],
        },
        currentUser,
      );
    }

    return currentUser;
  };

  const createArticles = async () => {
    const john = await createArticlesForAuthor(
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      30,
    );

    const jane = await createArticlesForAuthor(
      {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
      20,
    );

    return [john, jane];
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
    const [, jane] = await createArticles();

    for (const slug of [
      'john-doe-test-article-1',
      'john-doe-test-article-2',
      'john-doe-test-article-4',
      'john-doe-test-article-8',
      'john-doe-test-article-16',
    ]) {
      await service.favorite(slug, true, jane);
    }

    const [items, count] = await act(orm, () =>
      service.list(
        {
          limit: 10,
          offset: 0,
          favorited: 'Jane',
        },
        jane,
      ),
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
    const [john] = await createArticles();

    await profilesService.follow('John Doe', true, john);

    const [items, count] = await act(orm, () =>
      service.feed(
        {
          limit: 10,
          offset: 0,
        },
        john,
      ),
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
    const user = await actingAs(orm, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['Test Tag 1', 'Test Tag 2'],
      },
      user,
    );

    const article = await act(orm, () => service.get('test-article', user));

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
    const user = await actingAs(orm, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await orm.em
      .fork()
      .getRepository(Tag)
      .persistAndFlush(new Tag({ name: 'Existing Tag' }));

    const article = await act(orm, () =>
      service.create(
        {
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagList: ['Existing Tag', 'Test Tag 1', 'Test Tag 2'],
        },
        user,
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
    const user = await actingAs(orm, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    await expect(() =>
      act(orm, () =>
        service.create(
          {
            title: 'Test Article',
            description: 'Test Description',
            body: 'Test Body',
            tagList: [],
          },
          user,
        ),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  /**
   * Article Update
   */

  it('can update own article', async () => {
    const user = await actingAs(orm);

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    const article = await act(orm, () =>
      service.update(
        'test-article',
        {
          title: 'New Title',
          description: 'New Description',
          body: 'New Body',
        },
        user,
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
    const user = await actingAs(orm);

    await expect(() =>
      act(orm, () =>
        service.update(
          'test-article',
          {
            title: 'New Title',
            description: 'New Description',
            body: 'New Body',
          },
          user,
        ),
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('cannot update article of other author', async () => {
    let user = await actingAs(orm);

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    user = await actingAs(orm, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    await expect(() =>
      act(orm, () =>
        service.update(
          'test-article',
          {
            title: 'New Title',
            description: 'New Description',
            body: 'New Body',
          },
          user,
        ),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  /**
   * Article Delete
   */

  it('can delete own article with all comments', async () => {
    const user = await actingAs(orm);

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    await commentsService.create(
      'test-article',
      {
        body: 'New Comment 1',
      },
      user,
    );

    await commentsService.create(
      'test-article',
      {
        body: 'New Comment 2',
      },
      user,
    );

    await act(orm, () => service.delete('test-article', user));

    expect(await orm.em.getRepository(Article).count()).toBe(0);
    expect(await orm.em.getRepository(Comment).count()).toBe(0);
  });

  it('cannot delete article of other author', async () => {
    let user = await actingAs(orm);

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    user = await actingAs(orm, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    await expect(() =>
      act(orm, () => service.delete('test-article', user)),
    ).rejects.toThrow(BadRequestException);
  });

  it('cannot delete non existent article', async () => {
    const user = await actingAs(orm);

    await expect(() =>
      act(orm, () => service.delete('test-article', user)),
    ).rejects.toThrow(NotFoundError);
  });

  /**
   * Article Favorite
   */

  it('can favorite article', async () => {
    const user = await actingAs(orm);

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    const article = await act(orm, () =>
      service.favorite('test-article', true, user),
    );

    expect(article).toMatchObject({
      favorited: true,
      favoritesCount: 1,
    });
  });

  it('can unfavorite article', async () => {
    const user = await actingAs(orm);

    await service.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    await service.favorite('test-article', true, user);

    const article = await act(orm, () =>
      service.favorite('test-article', false, user),
    );

    expect(article).toMatchObject({
      favorited: false,
      favoritesCount: 0,
    });
  });

  it('cannot favorite non existent article', async () => {
    const user = await actingAs(orm);

    await expect(() =>
      act(orm, () => service.favorite('test-article', true, user)),
    ).rejects.toThrow(NotFoundError);
  });
});
