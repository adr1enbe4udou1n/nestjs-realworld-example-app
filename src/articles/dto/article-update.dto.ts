import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateArticleDTO {
  @ApiPropertyOptional()
  @ValidateIf((a) => a.title !== null)
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @ValidateIf((a) => a.description !== null)
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional()
  @ValidateIf((a) => a.body !== null)
  @IsNotEmpty()
  body?: string;
}

export class UpdateArticleRequest {
  @ApiProperty()
  article: UpdateArticleDTO;
}
