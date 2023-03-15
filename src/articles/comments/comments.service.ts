import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Article } from '../article.entity';
import { Comment } from './comment.entity';
import { NewCommentDTO } from './dto/comment-create.dto';
import { CommentDTO } from './dto/comment.dto';
import { User } from '../../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}

  async list(slug: string, currentUser: User | null = null) {
    const article = await this.articleRepository.findOneOrFail({ slug });

    const comments = await this.commentRepository.find(
      { article },
      {
        populate: ['author.followers'],
        orderBy: { id: 'DESC' },
      },
    );

    return comments.map((c) => CommentDTO.map(c, currentUser));
  }

  async create(slug: string, dto: NewCommentDTO, currentUser: User) {
    const article = await this.articleRepository.findOneOrFail({ slug });

    const comment = dto.map();
    comment.article = article;
    comment.author = currentUser;

    await this.commentRepository.persistAndFlush(comment);

    return CommentDTO.map(comment, currentUser);
  }

  async delete(slug: string, commentId: number, currentUser: User) {
    const article = await this.articleRepository.findOneOrFail({ slug });

    const comment = await this.commentRepository.findOneOrFail({
      id: commentId,
      article,
    });

    if (
      article.author.id !== currentUser.id &&
      comment.author.id !== currentUser.id
    ) {
      throw new BadRequestException(
        'You cannot delete comment of different user',
      );
    }

    await this.commentRepository.removeAndFlush(comment);
  }
}
