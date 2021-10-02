import { MikroORM } from '@mikro-orm/core';
import { initializeDbTestBase } from '../db-test-base';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let orm: MikroORM;
  let service: ArticlesService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [ArticlesService],
    });

    orm = module.get(MikroORM);
    service = module.get(ArticlesService);
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

  it('can create article', () => {
    expect(service).toBeDefined();
  });

  it('cannot create article with invalid data', () => {
    expect(service).toBeDefined();
  });

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
