import { ApiProperty } from '@nestjs/swagger';

export class PagedQuery {
  @ApiProperty({
    description: 'Limit number of articles returned (default is 20)',
    default: 20,
    required: false,
  })
  limit?: number;

  get securedLimit() {
    const max = 20;
    return Math.min(this.limit ?? max, max);
  }

  @ApiProperty({
    description: 'Offset/skip number of articles (default is 0)',
    default: 0,
    required: false,
  })
  offset?: number;
}

export class PagedResponse<T> {
  items: T[];

  total: number;
}
