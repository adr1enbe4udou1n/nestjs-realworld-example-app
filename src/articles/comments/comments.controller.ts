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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth.guard';
import { CommentsService } from './comments.service';
import { NewCommentRequest } from './dto/comment-create.dto';
import { CommentEnvelope, MultipleCommentsResponse } from './dto/comment.dto';

@Controller('articles/:slug/comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @ApiOperation({
    summary: 'Get comments for an article',
    description: 'Get the comments for an article. Auth is optional',
  })
  @Get()
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article that you want to get comments for',
  })
  @ApiResponse({ type: MultipleCommentsResponse })
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
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article that you want to create a comment for',
  })
  @ApiBody({
    description: 'Comment you want to create',
    type: NewCommentRequest,
  })
  @ApiResponse({ type: CommentEnvelope })
  async create(
    @Param('slug') slug: string,
    @Body() command: NewCommentRequest,
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
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article that you want to delete a comment for',
  })
  @ApiParam({
    name: 'commentId',
    description: 'ID of the comment you want to delete',
  })
  async delete(
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ) {
    return { comment: await this.commentsService.delete(slug, commentId) };
  }
}
