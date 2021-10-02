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
    service = module.get(CommentsService);
    articlesService = module.get(ArticlesService);
    userService = module.get(UserService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  /**
   * Comment List
   */

  it('can list all comments of article', () => {
    expect(service).toBeDefined();
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

  it('can delete own comment', () => {
    expect(service).toBeDefined();
  });

  it('can delete all comments of own article', () => {
    expect(service).toBeDefined();
  });

  it('cannot delete comment of other author', () => {
    expect(service).toBeDefined();
  });

  it('cannot delete comment with bad article', () => {
    expect(service).toBeDefined();
  });

  it('cannot delete comment with inexisting article', () => {
    expect(service).toBeDefined();
  });

  it('cannot delete non existent comment', () => {
    expect(service).toBeDefined();
  });
});
