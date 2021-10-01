import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsEnvelope } from './dto/tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Get tags',
    description: 'Get tags. Auth not required',
  })
  @Get()
  @ApiResponse({ type: TagsEnvelope })
  async get() {
    return { tags: await this.tagsService.list() };
  }
}
