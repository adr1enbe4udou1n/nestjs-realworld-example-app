import { ApiProperty } from '@nestjs/swagger';

export class PagedQuery {
  @ApiProperty({
    description: 'Limit number of articles returned (default is 20)',
    default: 20,
    required: false,
  })
  limit = 20;

  @ApiProperty({
    description: 'Offset/skip number of articles (default is 0)',
    default: 0,
    required: false,
  })
  offset = 0;
}

export class PagedResponse<T> {
  items: T[];

  total: number;
}
