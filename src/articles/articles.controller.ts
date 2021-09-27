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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { ArticlesService } from './articles.service';
import { ArticleCreateCommand } from './dto/article-create.dto';
import { ArticleUpdateCommand } from './dto/article-update.dto';
import { ArticleEnvelope, ArticlesEnvelope } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  @ApiResponse({ type: ArticlesEnvelope })
  async list(@Query() query: ArticlesListQuery) {
    return { article: await this.articlesService.list(query) };
  }

  @UseGuards(AuthGuard)
  @Get('feed')
  @ApiResponse({ type: ArticlesEnvelope })
  async feed(@Query() query: ArticlesListQuery) {
    return { article: await this.articlesService.feed(query) };
  }

  @Get(':slug')
  @ApiResponse({ type: ArticleEnvelope })
  async get(@Param() slug: string) {
    return { article: await this.articlesService.get(slug) };
  }

  @Post()
  @ApiResponse({ type: ArticleEnvelope })
  async create(@Param() slug: string, @Body() command: ArticleCreateCommand) {
    return { article: await this.articlesService.create(slug, command) };
  }

  @Put(':slug')
  @ApiResponse({ type: ArticleEnvelope })
  async update(@Param() slug: string, @Body() command: ArticleUpdateCommand) {
    return { article: await this.articlesService.update(slug, command) };
  }

  @Delete(':slug')
  async delete(@Param() slug: string) {
    return { article: await this.articlesService.delete(slug) };
  }

  @Post(':slug/favorite')
  @ApiResponse({ type: ArticleEnvelope })
  async favorite(@Param() slug: string) {
    return { article: await this.articlesService.favorite(slug, true) };
  }

  @Delete(':slug/favorite')
  @ApiResponse({ type: ArticleEnvelope })
  async unfavorite(@Param() slug: string) {
    return { article: await this.articlesService.favorite(slug, false) };
  }
}
