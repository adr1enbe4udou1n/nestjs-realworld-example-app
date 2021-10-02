import { ApiProperty } from '@nestjs/swagger';
import { PagedQuery } from '../../pagination';

export class ArticlesListQuery extends PagedQuery {
  @ApiProperty({ description: 'Filter by author (username)', required: false })
  author?: string;

  @ApiProperty({
    description: 'Filter by favorites of a user (username)',
    required: false,
  })
  favorited?: string;

  @ApiProperty({ description: 'Filter by tag', required: false })
  tag?: string;
}
