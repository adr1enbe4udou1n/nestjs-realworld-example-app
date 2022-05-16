import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsResponse } from './dto/tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    operationId: 'GetTags',
    summary: 'Get tags',
    description: 'Get tags. Auth not required',
  })
  @Get()
  @ApiResponse({ type: TagsResponse })
  async get(): Promise<TagsResponse> {
    return { tags: await this.tagsService.list() };
  }
}
