import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth.guard';
import { CommentsService } from './comments.service';
import { CommentCreateCommand } from './dto/comment-create.dto';
import { CommentEnvelope, CommentsEnvelope } from './dto/comment.dto';

@Controller('articles/:slug/comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @ApiResponse({ type: CommentsEnvelope })
  async get(@Param('slug') slug: string) {
    return { comment: await this.commentsService.list(slug) };
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({ type: CommentEnvelope })
  async follow(
    @Param('slug') slug: string,
    @Body() command: CommentCreateCommand,
  ) {
    return {
      comment: await this.commentsService.create(slug, command.comment),
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':commentId')
  async unfollow(
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ) {
    return { comment: await this.commentsService.delete(slug, commentId) };
  }
}
