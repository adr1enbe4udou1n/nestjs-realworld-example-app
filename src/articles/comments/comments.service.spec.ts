import { MikroORM, NotFoundError } from '@mikro-orm/core';
import { UserService } from '../../user/user.service';
import { act, actingAs, initializeDbTestBase } from '../../db-test-base';
import { CommentsService } from './comments.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NewCommentDTO } from './dto/comment-create.dto';
import { plainToClass } from 'class-transformer';
import { Comment } from './comment.entity';
import { ArticlesService } from '../articles.service';
import { NewArticleDTO } from '../dto/article-create.dto';
import { ContextIdFactory } from '@nestjs/core';

describe('CommentsService', () => {
  let orm: MikroORM;
  let service: CommentsService;
  let articlesService: ArticlesService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [CommentsService, ArticlesService, UserService],
    });

    orm = module.get(MikroORM);

    const contextId = ContextIdFactory.create();
    service = await module.resolve(CommentsService, contextId);
    articlesService = await module.resolve(ArticlesService, contextId);
    userService = await module.resolve(UserService, contextId);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  /**
   * Comment List
   */

  it('can list all comments of article', async () => {
    await actingAs(orm, userService, {
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    for (let i = 1; i <= 5; i++) {
      await act(orm, () =>
        service.create(
          'test-article',
          plainToClass(NewCommentDTO, {
            body: `New John Comment ${i}`,
          }),
        ),
      );
    }

    await actingAs(orm, userService, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      bio: 'My Bio',
      image: 'https://i.pravatar.cc/300',
    });

    for (let i = 1; i <= 5; i++) {
      await act(orm, () =>
        service.create(
          'test-article',
          plainToClass(NewCommentDTO, {
            body: `New Jane Comment ${i}`,
          }),
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
    await actingAs(orm, userService);

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    const comment = await act(orm, () =>
      service.create(
        'test-article',
        plainToClass(NewCommentDTO, {
          body: 'New Comment',
        }),
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
    await expect(() =>
      act(orm, () =>
        service.create(
          'test-article',
          plainToClass(NewCommentDTO, {
            body: 'New Comment',
          }),
        ),
      ),
    ).rejects.toThrow(NotFoundError);
  });

  /**
   * Comment Delete
   */

  it('can delete own comment', async () => {
    await actingAs(orm, userService);

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    const comment = await service.create(
      'test-article',
      plainToClass(NewCommentDTO, {
        body: 'New Comment 1',
      }),
    );

    await act(orm, () => service.delete('test-article', comment.id));

    expect(await orm.em.getRepository(Comment).count()).toBe(0);
  });

  it('can delete all comments of own article', async () => {
    const user = await actingAs(orm, userService);

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    await service.create(
      'test-article',
      plainToClass(NewCommentDTO, {
        body: 'New Comment 1',
      }),
    );

    await actingAs(orm, userService, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    const comment = await service.create(
      'test-article',
      plainToClass(NewCommentDTO, {
        body: 'New Comment 2',
      }),
    );

    userService.user = user;

    await act(orm, () => service.delete('test-article', comment.id));

    expect(await orm.em.getRepository(Comment).count()).toBe(1);
  });

  it('cannot delete comment of other author', async () => {
    await actingAs(orm, userService);

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    const comment = await service.create(
      'test-article',
      plainToClass(NewCommentDTO, {
        body: 'New Comment 1',
      }),
    );

    await actingAs(orm, userService, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    await expect(() =>
      act(orm, () => service.delete('test-article', comment.id)),
    ).rejects.toThrow(BadRequestException);
  });

  it('cannot delete comment with bad article', async () => {
    await actingAs(orm, userService);

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Bad Article',
        description: 'Bad Description',
        body: 'Bad Body',
      }),
    );

    const comment = await service.create(
      'test-article',
      plainToClass(NewCommentDTO, {
        body: 'New Comment 1',
      }),
    );

    await expect(() =>
      act(orm, () => service.delete('bad-article', comment.id)),
    ).rejects.toThrow(NotFoundError);
  });

  it('cannot delete comment with inexisting article', async () => {
    await expect(() =>
      act(orm, () => service.delete('test-article', 1)),
    ).rejects.toThrow(NotFoundError);
  });

  it('cannot delete non existent comment', async () => {
    await actingAs(orm, userService);

    await articlesService.create(
      plainToClass(NewArticleDTO, {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
      }),
    );

    await expect(() =>
      act(orm, () => service.delete('test-article', 1)),
    ).rejects.toThrow(NotFoundError);
  });
});
