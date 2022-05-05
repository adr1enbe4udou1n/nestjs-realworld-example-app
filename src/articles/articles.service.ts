import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PagedQuery } from '../pagination';
import { Article } from './article.entity';
import { NewArticleDTO } from './dto/article-create.dto';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { ArticleDTO } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';
import { Tag } from '../tags/tag.entity';
import slugify from 'slugify';
import { User } from '../users/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  limit(query: PagedQuery) {
    const max = 20;
    return Math.min(query.limit ?? max, max);
  }

  async list(
    query: ArticlesListQuery,
    currentUser: User | null = null,
  ): Promise<[ArticleDTO[], number]> {
    const subQb = this.articleRepository
      .createQueryBuilder('a')
      .select('a.id')
      .where({
        ...(query.author && {
          author: { name: { $like: `%${query.author}%` } },
        }),
        ...(query.tag && {
          tags: { name: query.tag },
        }),
        ...(query.favorited && {
          favoredUsers: { name: { $like: `%${query.favorited}%` } },
        }),
      });

    const qb = this.articleRepository.createQueryBuilder('a').where({
      id: { $in: subQb.getKnexQuery() },
    });

    const [{ count }, items] = await Promise.all([
      qb.count('a.id', true).execute('get'),
      qb
        .select('*')
        .orderBy({ id: 'DESC' })
        .limit(this.limit(query))
        .offset(query.offset)
        .getResult(),
    ]);

    await this.articleRepository.populate(items, [
      'author.followers',
      'tags',
      'favoredUsers',
    ]);

    return [items.map((a) => ArticleDTO.map(a, currentUser)), +count];
  }

  async feed(
    query: PagedQuery,
    currentUser: User,
  ): Promise<[ArticleDTO[], number]> {
    const [items, count] = await this.articleRepository.findAndCount(
      {
        author: { followers: { id: currentUser.id } },
      },
      {
        populate: ['author.followers', 'tags', 'favoredUsers'],
        orderBy: { id: 'DESC' },
        limit: this.limit(query),
        offset: query.offset,
      },
    );

    return [items.map((a) => ArticleDTO.map(a, currentUser)), +count];
  }

  async get(
    slug: string,
    currentUser: User | null = null,
  ): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOneOrFail(
      { slug },
      {
        populate: ['author.followers', 'tags', 'favoredUsers'],
      },
    );

    return ArticleDTO.map(article, currentUser);
  }

  async create(dto: NewArticleDTO, currentUser: User): Promise<ArticleDTO> {
    if (
      (await this.articleRepository.count({
        slug: slugify(dto.title, { lower: true }),
      })) > 0
    ) {
      throw new BadRequestException('Article with same title already exist');
    }

    const article = NewArticleDTO.map(dto);
    article.author = currentUser;

    const existingTags = await this.tagRepository.find({
      name: { $in: dto.tagList },
    });

    article.tags.add(
      ...dto.tagList.map((name) => {
        const tag = existingTags.find((t) => t.name === name);

        if (tag) return tag;

        return new Tag({ name });
      }),
    );

    await this.articleRepository.persistAndFlush(article);

    return ArticleDTO.map(article, currentUser);
  }

  async update(
    slug: string,
    dto: UpdateArticleDTO,
    currentUser: User,
  ): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOneOrFail(
      { slug },
      {
        populate: ['author.followers', 'tags', 'favoredUsers'],
      },
    );

    if (article.author.id !== currentUser.id) {
      throw new BadRequestException(
        'You cannot edit article from other authors',
      );
    }

    await this.articleRepository.persistAndFlush(
      UpdateArticleDTO.map(dto, article),
    );

    return ArticleDTO.map(article, currentUser);
  }

  async delete(slug: string, currentUser: User) {
    const article = await this.articleRepository.findOneOrFail(
      { slug },
      {
        populate: ['comments'],
      },
    );

    if (article.author.id !== currentUser.id) {
      throw new BadRequestException(
        'You cannot edit article from other authors',
      );
    }

    await this.articleRepository.removeAndFlush(article);
  }

  async favorite(
    slug: string,
    favorite: boolean,
    currentUser: User,
  ): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOneOrFail(
      { slug },
      {
        populate: ['tags', 'favoredUsers', 'author.followers'],
      },
    );

    const favoredUser = article.favoredUsers
      .getItems()
      .find((u) => u.id === currentUser.id);

    if (favorite) {
      if (!favoredUser) {
        article.favoredUsers.add(currentUser);
      }
    } else {
      if (favoredUser) {
        article.favoredUsers.remove(favoredUser);
      }
    }

    await this.articleRepository.flush();

    return ArticleDTO.map(article, currentUser);
  }
}
