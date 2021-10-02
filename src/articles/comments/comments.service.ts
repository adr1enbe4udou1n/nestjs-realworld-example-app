import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Article } from '../article.entity';
import { Comment } from './comment.entity';
import { NewCommentDTO } from './dto/comment-create.dto';
import { CommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    private readonly userService: UserService,
  ) {}

  async list(slug: string): Promise<CommentDTO[]> {
    const article = await this.articleRepository.findOneOrFail({ slug });

    const comments = await this.commentRepository.find(
      { article },
      ['author.followers'],
      { id: 'DESC' },
    );

    return comments.map((c) => CommentDTO.map(c, this.userService));
  }

  async create(slug: string, dto: NewCommentDTO): Promise<CommentDTO> {
    const article = await this.articleRepository.findOneOrFail({ slug });

    const comment = dto.map();
    comment.article = article;
    comment.author = this.userService.user;

    await this.commentRepository.persistAndFlush(comment);

    return CommentDTO.map(comment, this.userService);
  }

  async delete(slug: string, commentId: number) {
    const article = await this.articleRepository.findOneOrFail({ slug });

    const comment = await this.commentRepository.findOneOrFail({
      id: commentId,
      article,
    });

    if (
      article.author.id !== this.userService.user.id &&
      comment.author.id !== this.userService.user.id
    ) {
      throw new BadRequestException(
        'You cannot delete comment of different user',
      );
    }

    await this.commentRepository.removeAndFlush(comment);
  }
}
