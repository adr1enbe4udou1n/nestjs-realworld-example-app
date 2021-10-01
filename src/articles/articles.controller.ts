import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { ArticlesService } from './articles.service';
import { ArticleCreateCommand } from './dto/article-create.dto';
import { ArticleUpdateCommand } from './dto/article-update.dto';
import { ArticleEnvelope, ArticlesEnvelope } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Get recent articles globally',
    description:
      'Get most recent articles globally. Use query parameters to filter results. Auth is optional',
  })
  @Get()
  @ApiResponse({ type: ArticlesEnvelope })
  async list(@Query() query: ArticlesListQuery) {
    return { article: await this.articlesService.list(query) };
  }

  @ApiBearerAuth()
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Get recent articles from users you follow',
    description:
      'Get most recent articles from users you follow. Use query parameters to limit. Auth is required',
  })
  @UseGuards(AuthGuard)
  @Get('feed')
  @ApiResponse({ type: ArticlesEnvelope })
  async feed(@Query() query: ArticlesListQuery) {
    return { article: await this.articlesService.feed(query) };
  }

  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Get an article',
    description: 'Get an article. Auth not required',
  })
  @Get(':slug')
  @ApiResponse({ type: ArticleEnvelope })
  async get(@Param() slug: string) {
    return { article: await this.articlesService.get(slug) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Create an article',
    description: 'Create an article. Auth is required',
  })
  @Post()
  @ApiResponse({ type: ArticleEnvelope })
  async create(@Param() slug: string, @Body() command: ArticleCreateCommand) {
    return { article: await this.articlesService.create(slug, command) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Update an article',
    description: 'Update an article. Auth is required',
  })
  @Put(':slug')
  @ApiResponse({ type: ArticleEnvelope })
  async update(@Param() slug: string, @Body() command: ArticleUpdateCommand) {
    return { article: await this.articlesService.update(slug, command) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Delete an article',
    description: 'Delete an article. Auth is required',
  })
  @Delete(':slug')
  async delete(@Param() slug: string) {
    return { article: await this.articlesService.delete(slug) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiTags('Favorites')
  @ApiOperation({
    summary: 'Favorite an article',
    description: 'Favorite an article. Auth is required',
  })
  @Post(':slug/favorite')
  @ApiResponse({ type: ArticleEnvelope })
  async favorite(@Param() slug: string) {
    return { article: await this.articlesService.favorite(slug, true) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiTags('Favorites')
  @ApiOperation({
    summary: 'Unfavorite an article',
    description: 'Unfavorite an article. Auth is required',
  })
  @Delete(':slug/favorite')
  @ApiResponse({ type: ArticleEnvelope })
  async unfavorite(@Param() slug: string) {
    return { article: await this.articlesService.favorite(slug, false) };
  }
}
