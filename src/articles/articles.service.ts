import { BadRequestException, Injectable } from '@nestjs/common';
import { PagedQuery } from '../pagination';
import { NewArticleDTO } from './dto/article-create.dto';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { ArticleDTO } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  limit(query: PagedQuery) {
    const max = 20;
    return Math.min(query.limit ?? max, max);
  }

  async list(query: ArticlesListQuery, currentUser: User | null = null) {
    const where = {
      ...(query.author && {
        author: { name: { contains: query.author } },
      }),
      ...(query.tag && {
        tags: { some: { tag: { name: query.tag } } },
      }),
      ...(query.favorited && {
        favoredUsers: { some: { user: { name: query.favorited } } },
      }),
    };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        orderBy: { id: 'desc' },
        take: this.limit(query),
        skip: query.offset,
        include: {
          favoredUsers: true,
          tags: true,
          author: { include: { followers: true } },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return [items.map((a) => ArticleDTO.map(a, currentUser)), +count] as const;
  }

  async feed(query: PagedQuery, currentUser: User) {
    const where = {
      author: { following: { some: { followerId: currentUser.id } } },
    };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        orderBy: { id: 'desc' },
        take: this.limit(query),
        skip: query.offset,
        include: {
          favoredUsers: true,
          tags: true,
          author: { include: { followers: true } },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return [items.map((a) => ArticleDTO.map(a, currentUser)), +count] as const;
  }

  async get(slug: string, currentUser: User | null = null) {
    const article = await this.prisma.article.findFirstOrThrow({
      where: { slug },
      include: {
        favoredUsers: true,
        tags: true,
        author: { include: { followers: true } },
      },
    });

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

    const createdArticle = await this.prisma.article.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title, { lower: true }),
        description: dto.description,
        body: dto.body,
        authorId: currentUser.id,
      },
    });

    await this.prisma.tag.createMany({
      skipDuplicates: true,
      data: dto.tagList.map((name) => ({ name })),
    });

    const allTags = await this.prisma.tag.findMany({
      where: { name: { in: dto.tagList } },
    });

    await this.prisma.article.update({
      where: { id: createdArticle.id },
      data: {
        tags: {
          connect: allTags.map((t) => ({
            articleId_tagId: {
              articleId: createdArticle.id,
              tagId: t.id,
            },
          })),
        },
      },
    });

    return ArticleDTO.map(createdArticle, currentUser);
  }

  async update(slug: string, dto: UpdateArticleDTO, currentUser: User) {
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

    const updatedArticle = await this.prisma.article.update({
      where: { slug },
      include: {
        favoredUsers: true,
        tags: true,
        author: { include: { followers: true } },
      },
      data: {
        title: dto.title ?? article.title,
        description: dto.description ?? article.description,
        body: dto.body ?? article.body,
      },
    });

    return ArticleDTO.map(updatedArticle, currentUser);
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
