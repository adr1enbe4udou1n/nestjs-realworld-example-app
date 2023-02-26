import { MikroORM, NotFoundError } from '@mikro-orm/core';
import {
  act,
  actingAs,
  initializeDbTestBase,
  refreshDatabase,
} from '../../db-test-base';
import { CommentsService } from './comments.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NewCommentDTO } from './dto/comment-create.dto';
import { Comment } from './comment.entity';
import { ArticlesService } from '../articles.service';

describe('CommentsService', () => {
  let orm: MikroORM;
  let service: CommentsService;
  let articlesService: ArticlesService;

  beforeAll(async () => {
    const module = await initializeDbTestBase({
      providers: [CommentsService, ArticlesService],
    });

    orm = module.get(MikroORM);

    service = await module.resolve(CommentsService);
    articlesService = await module.resolve(ArticlesService);
  });

  beforeEach(async () => {
    await refreshDatabase(orm);
  });

  afterAll(async () => {
    await orm.close();
  });

  /**
   * Comment List
   */

  it('can list all comments of article', async () => {
    let user = await actingAs(orm, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await articlesService.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    for (let i = 1; i <= 5; i++) {
      await act(orm, () =>
        service.create(
          'test-article',
          {
            body: `New John Comment ${i}`,
          },
          user,
        ),
      );
    }

    user = await actingAs(orm, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    for (let i = 1; i <= 5; i++) {
      await act(orm, () =>
        service.create(
          'test-article',
          {
            body: `New Jane Comment ${i}`,
          },
          user,
        ),
      );
    }

    const comments = await act(orm, () => service.list('test-article'));

    expect(comments.length).toBe(10);
    expect(comments[0]).toMatchObject({
      body: 'New Jane Comment 5',
      author: {
        username: 'Jane Doe',
        bio: 'My Bio',
        image: 'https://i.pravatar.cc/300',
      },
    });
  });

  it('cannot list all comments of non existent article', async () => {
    await expect(() =>
      act(orm, () => service.list('test-article')),
    ).rejects.toThrow(NotFoundError);
  });

  /**
   * Comment Create
   */

  it('can create comment', async () => {
    const user = await actingAs(orm);

    await articlesService.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    const comment = await act(orm, () =>
      service.create(
        'test-article',
        {
          body: 'New Comment',
        },
        user,
      ),
    );

    expect(comment).toMatchObject({
      body: 'New Comment',
      author: {
        username: 'John Doe',
      },
    });

    expect(
      await orm.em.getRepository(Comment).count({ body: 'New Comment' }),
    ).toBe(1);
  });

  it.each([
    {
      body: '',
    },
  ])('cannot create comment with invalid data', async (data) => {
    await expect(() =>
      new ValidationPipe().transform(data, {
        type: 'body',
        metatype: NewCommentDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('cannot create comment to non existent article', async () => {
    const user = await actingAs(orm);

    await expect(() =>
      act(orm, () =>
        service.create(
          'test-article',
          {
            body: 'New Comment',
          },
          user,
        ),
      ),
    ).rejects.toThrow(NotFoundError);
  });

  /**
   * Comment Delete
   */

  it('can delete own comment', async () => {
    const user = await actingAs(orm);

    await articlesService.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    const comment = await service.create(
      'test-article',
      {
        body: 'New Comment 1',
      },
      user,
    );

    await act(orm, () => service.delete('test-article', comment.id, user));

    expect(await orm.em.getRepository(Comment).count()).toBe(0);
  });

  it('can delete all comments of own article', async () => {
    let user = await actingAs(orm);

    await articlesService.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    await service.create(
      'test-article',
      {
        body: 'New Comment 1',
      },
      user,
    );

    user = await actingAs(orm, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    const comment = await service.create(
      'test-article',
      {
        body: 'New Comment 2',
      },
      user,
    );

    await act(orm, () => service.delete('test-article', comment.id, user));

    expect(await orm.em.getRepository(Comment).count()).toBe(1);
  });

  it('cannot delete comment of other author', async () => {
    let user = await actingAs(orm);

    await articlesService.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    const comment = await service.create(
      'test-article',
      {
        body: 'New Comment 1',
      },
      user,
    );

    user = await actingAs(orm, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    await expect(() =>
      act(orm, () => service.delete('test-article', comment.id, user)),
    ).rejects.toThrow(BadRequestException);
  });

  it('cannot delete comment with bad article', async () => {
    const user = await actingAs(orm);

    await articlesService.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    await articlesService.create(
      {
        title: 'Bad Article',
        description: 'Bad Description',
        body: 'Bad Body',
        tagList: [],
      },
      user,
    );

    const comment = await service.create(
      'test-article',
      {
        body: 'New Comment 1',
      },
      user,
    );

    await expect(() =>
      act(orm, () => service.delete('bad-article', comment.id, user)),
    ).rejects.toThrow(NotFoundError);
  });

  it('cannot delete comment with inexisting article', async () => {
    const user = await actingAs(orm);

    await expect(() =>
      act(orm, () => service.delete('test-article', 1, user)),
    ).rejects.toThrow(NotFoundError);
  });

  it('cannot delete non existent comment', async () => {
    const user = await actingAs(orm);

    await articlesService.create(
      {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: [],
      },
      user,
    );

    await expect(() =>
      act(orm, () => service.delete('test-article', 1, user)),
    ).rejects.toThrow(NotFoundError);
  });
});
