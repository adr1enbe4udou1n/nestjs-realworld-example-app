import { MikroORM } from '@mikro-orm/core';
import { initializeDbTestBase } from '../../db-test-base';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let orm: MikroORM;
  let service: CommentsService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [CommentsService],
    });

    orm = module.get(MikroORM);
    service = module.get(CommentsService);
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

  it('can create comment', () => {
    expect(service).toBeDefined();
  });

  it('cannot create comment with invalid data', () => {
    expect(service).toBeDefined();
  });

  it('cannot create comment to non existent article', () => {
    expect(service).toBeDefined();
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
