import { BadRequestException, Injectable } from '@nestjs/common';
import { PagedQuery } from '../pagination';
import { NewArticleDTO } from './dto/article-create.dto';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { ArticleDTO } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { User, Tag } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  limit(query: PagedQuery) {
    const max = 20;
    return Math.min(query.limit ?? max, max);
  }

  async list(query: ArticlesListQuery, currentUser: User | null = null) {
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
      qb.clone().count('a.id', true).execute('get'),
      qb
        .clone()
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

    return [items.map((a) => ArticleDTO.map(a, currentUser)), +count] as const;
  }

  async feed(query: PagedQuery, currentUser: User) {
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

    return [items.map((a) => ArticleDTO.map(a, currentUser)), +count] as const;
  }

  async get(slug: string, currentUser: User | null = null) {
    const article = await this.articleRepository.findOneOrFail(
      { slug },
      {
        populate: ['author.followers', 'tags', 'favoredUsers'],
      },
    );

    return ArticleDTO.map(article, currentUser);
  }

  async create(dto: NewArticleDTO, currentUser: User) {
    if (
      (await this.prisma.article.count({
        where: {
          slug: slugify(dto.title, { lower: true }),
        },
      })) > 0
    ) {
      throw new BadRequestException('Article with same title already exist');
    }

    const article = NewArticleDTO.map(dto);
    article.author = currentUser;

    const existingTags = await this.prisma.tag.findMany({
      where: { name: { in: dto.tagList } },
    });

    article.tags.add(
      dto.tagList.map((name) => {
        const tag = existingTags.find((t) => t.name === name);

        if (tag) return tag;

        return new Tag({ name });
      }),
    );

    await this.prisma.article.create(article);

    return ArticleDTO.map(article, currentUser);
  }

  async update(slug: string, dto: UpdateArticleDTO, currentUser: User) {
    const article = await this.prisma.article.findFirstOrThrow({
      where: { slug },
      include: {
        favoredUsers: true,
        tags: true,
        author: { include: { followers: true } },
      },
    });

    if (article.author.id !== currentUser.id) {
      throw new BadRequestException(
        'You cannot edit article from other authors',
      );
    }

    await this.prisma.article.update(UpdateArticleDTO.map(dto, article));

    return ArticleDTO.map(article, currentUser);
  }

  async delete(slug: string, currentUser: User) {
    const article = await this.prisma.article.findFirstOrThrow({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (article.author.id !== currentUser.id) {
      throw new BadRequestException(
        'You cannot edit article from other authors',
      );
    }

    await this.prisma.article.delete({
      where: { slug },
      include: {
        comments: true,
      },
    });
  }

  async favorite(slug: string, favorite: boolean, currentUser: User) {
    const article = await this.prisma.article.findFirstOrThrow({
      where: { slug },
      include: {
        favoredUsers: true,
        tags: true,
        author: { include: { followers: true } },
      },
    });

    if (favorite) {
      await this.prisma.user.update({
        where: { id: currentUser.id },
        data: {
          favoriteArticles: {
            connect: {
              articleId_userId: {
                articleId: article.id,
                userId: currentUser.id,
              },
            },
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: currentUser.id },
        data: {
          favoriteArticles: {
            disconnect: {
              articleId_userId: {
                articleId: article.id,
                userId: currentUser.id,
              },
            },
          },
        },
      });
    }

    return ArticleDTO.map(article, currentUser);
  }
}
