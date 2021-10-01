import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { NewCommentDTO } from './dto/comment-create.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}

  list(slug: string) {
    throw new Error('Method not implemented.');
  }
  create(slug: string, comment: NewCommentDTO) {
    throw new Error('Method not implemented.');
  }
  delete(slug: string, commentId: number) {
    throw new Error('Method not implemented.');
  }
}
