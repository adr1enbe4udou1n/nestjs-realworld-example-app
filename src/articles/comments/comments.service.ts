import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { NewCommentDTO } from './dto/comment-create.dto';
import { CommentDTO } from './dto/comment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async list(slug: string, currentUser: User | null = null) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { slug },
    });

    const comments = await this.prisma.comment.findMany({
      where: { article },
      orderBy: { id: 'desc' },
      include: { author: { include: { following: true } } },
    });

    return comments.map((c) => CommentDTO.map(c, currentUser));
  }

  async create(slug: string, dto: NewCommentDTO, currentUser: User) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { slug },
    });

    const comment = await this.prisma.comment.create({
      data: {
        body: dto.body,
        articleId: article.id,
        authorId: currentUser.id,
      },
      include: { author: { include: { following: true } } },
    });

    return CommentDTO.map(comment, currentUser);
  }

  async delete(slug: string, commentId: number, currentUser: User) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { slug },
    });

    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: {
        id: commentId,
      },
    });

    if (article.id !== comment.articleId) {
      throw new BadRequestException('Comment not found');
    }

    if (
      article.authorId !== currentUser.id &&
      comment.authorId !== currentUser.id
    ) {
      throw new BadRequestException(
        'You cannot delete comment of different user',
      );
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
  }
}
