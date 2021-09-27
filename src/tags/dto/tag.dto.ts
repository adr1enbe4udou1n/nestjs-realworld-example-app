import { ApiProperty } from '@nestjs/swagger';

export class TagsEnvelope {
  @ApiProperty()
  tags: string[];
}
