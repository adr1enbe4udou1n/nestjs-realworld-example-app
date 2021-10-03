import { ApiProperty } from '@nestjs/swagger';

export class PagedQuery {
  @ApiProperty({
    description: 'Limit number of articles returned (default is 20)',
    default: 20,
    required: false,
  })
  _limit = 20;

  get limit() {
    return this._limit;
  }
  set limit(limit: number) {
    if (limit < this._limit) {
      this._limit = limit;
    }
  }

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
