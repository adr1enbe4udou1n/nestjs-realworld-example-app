import { ApiProperty } from '@nestjs/swagger';

export class TagsResponse {
  @ApiProperty()
  tags: string[] = [];
}
