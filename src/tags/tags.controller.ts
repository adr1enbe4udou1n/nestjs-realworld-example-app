import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsEnvelope } from './dto/tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
@ApiTags('tags')
export class TagsController {
  constructor(private tagService: TagsService) {}

  @Get()
  @ApiResponse({ type: TagsEnvelope })
  async get() {
    return { tags: await this.tagService.list() };
  }
}
