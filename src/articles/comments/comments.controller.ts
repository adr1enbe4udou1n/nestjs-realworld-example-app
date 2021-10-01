import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth.guard';
import { CommentsService } from './comments.service';
import { CommentCreateCommand } from './dto/comment-create.dto';
import { CommentEnvelope, CommentsEnvelope } from './dto/comment.dto';

@Controller('articles/:slug/comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @ApiOperation({
    summary: 'Get comments for an article',
    description: 'Get the comments for an article. Auth is optional',
  })
  @Get()
  @ApiResponse({ type: CommentsEnvelope })
  async get(@Param('slug') slug: string) {
    return { comment: await this.commentsService.list(slug) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Create a comment for an article',
    description: 'Create a comment for an article. Auth is required',
  })
  @Post()
  @ApiResponse({ type: CommentEnvelope })
  async create(
    @Param('slug') slug: string,
    @Body() command: CommentCreateCommand,
  ) {
    return {
      comment: await this.commentsService.create(slug, command.comment),
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete a comment for an article',
    description: 'Delete a comment for an article. Auth is required',
  })
  @Delete(':commentId')
  async delete(
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ) {
    return { comment: await this.commentsService.delete(slug, commentId) };
  }
}
