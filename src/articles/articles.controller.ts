import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PagedQuery } from '../pagination';
import { ArticlesService } from './articles.service';
import { NewArticleRequest } from './dto/article-create.dto';
import { UpdateArticleRequest } from './dto/article-update.dto';
import {
  SingleArticleResponse,
  MultipleArticlesResponse,
} from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Get recent articles globally',
    description:
      'Get most recent articles globally. Use query parameters to filter results. Auth is optional',
  })
  @Get()
  @ApiResponse({ type: MultipleArticlesResponse })
  async list(
    @Query() query: ArticlesListQuery,
    @Request() req,
  ): Promise<MultipleArticlesResponse> {
    const [items, count] = await this.articlesService.list(query, req.user);
    return { articles: items, articlesCount: count };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Get recent articles from users you follow',
    description:
      'Get most recent articles from users you follow. Use query parameters to limit. Auth is required',
  })
  @Get('feed')
  @ApiResponse({ type: MultipleArticlesResponse })
  async feed(
    @Query() query: PagedQuery,
    @Request() req,
  ): Promise<MultipleArticlesResponse> {
    const [items, count] = await this.articlesService.feed(query, req.user);
    return { articles: items, articlesCount: count };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Get an article',
    description: 'Get an article. Auth not required',
  })
  @Get(':slug')
  @ApiParam({ name: 'slug', description: 'Slug of the article to get' })
  @ApiResponse({ type: SingleArticleResponse })
  async get(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<SingleArticleResponse> {
    return { article: await this.articlesService.get(slug, req.user) };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Create an article',
    description: 'Create an article. Auth is required',
  })
  @Post()
  @HttpCode(200)
  @ApiBody({ description: 'Article to create', type: NewArticleRequest })
  @ApiResponse({ type: SingleArticleResponse })
  async create(
    @Body() command: NewArticleRequest,
    @Request() req,
  ): Promise<SingleArticleResponse> {
    return {
      article: await this.articlesService.create(command.article, req.user),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Update an article',
    description: 'Update an article. Auth is required',
  })
  @Put(':slug')
  @ApiParam({ name: 'slug', description: 'Slug of the article to update' })
  @ApiBody({
    description: 'Article to update',
    type: UpdateArticleRequest,
  })
  @ApiResponse({ type: SingleArticleResponse })
  async update(
    @Param('slug') slug: string,
    @Body() command: UpdateArticleRequest,
    @Request() req,
  ): Promise<SingleArticleResponse> {
    return {
      article: await this.articlesService.update(
        slug,
        command.article,
        req.user,
      ),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiTags('Articles')
  @ApiOperation({
    summary: 'Delete an article',
    description: 'Delete an article. Auth is required',
  })
  @Delete(':slug')
  @ApiParam({ name: 'slug', description: 'Slug of the article to delete' })
  async delete(@Param('slug') slug: string, @Request() req) {
    return { article: await this.articlesService.delete(slug, req.user) };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiTags('Favorites')
  @ApiOperation({
    summary: 'Favorite an article',
    description: 'Favorite an article. Auth is required',
  })
  @Post(':slug/favorite')
  @HttpCode(200)
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article that you want to favorite',
  })
  @ApiResponse({ type: SingleArticleResponse })
  async favorite(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<SingleArticleResponse> {
    return {
      article: await this.articlesService.favorite(slug, true, req.user),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiTags('Favorites')
  @ApiOperation({
    summary: 'Unfavorite an article',
    description: 'Unfavorite an article. Auth is required',
  })
  @Delete(':slug/favorite')
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article that you want to unfavorite',
  })
  @ApiResponse({ type: SingleArticleResponse })
  async unfavorite(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<SingleArticleResponse> {
    return {
      article: await this.articlesService.favorite(slug, false, req.user),
    };
  }
}
