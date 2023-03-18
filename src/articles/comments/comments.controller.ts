import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Request,
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
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { JwtGuestAuthGuard } from '../../auth/jwt-guest-auth.guard';
import { CommentsService } from './comments.service';
import { NewCommentRequest } from './dto/comment-create.dto';
import {
  SingleCommentResponse,
  MultipleCommentsResponse,
} from './dto/comment.dto';

@Controller('articles/:slug/comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtGuestAuthGuard)
  @ApiOperation({
    operationId: 'GetArticleComments',
    summary: 'Get comments for an article',
    description: 'Get the comments for an article. Auth is optional',
  })
  @Get()
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article that you want to get comments for',
  })
  @ApiResponse({ type: MultipleCommentsResponse })
  async get(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<MultipleCommentsResponse> {
    return { comments: await this.commentsService.list(slug, req.user) };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'CreateArticleComment',
    summary: 'Create a comment for an article',
    description: 'Create a comment for an article. Auth is required',
  })
  @Post()
  @HttpCode(200)
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article that you want to create a comment for',
  })
  @ApiBody({
    description: 'Comment you want to create',
    type: NewCommentRequest,
  })
  @ApiResponse({ type: SingleCommentResponse })
  async create(
    @Param('slug') slug: string,
    @Body() command: NewCommentRequest,
    @Request() req,
  ): Promise<SingleCommentResponse> {
    return {
      comment: await this.commentsService.create(
        slug,
        command.comment,
        req.user,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'DeleteArticleComment',
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
    @Param('commentId', ParseIntPipe) commentId: number,
    @Request() req,
  ) {
    return {
      comment: await this.commentsService.delete(slug, commentId, req.user),
    };
  }
}
