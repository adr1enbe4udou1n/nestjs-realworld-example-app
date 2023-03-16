import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NewCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  body: string;
}

export class NewCommentRequest {
  @ApiProperty()
  comment: NewCommentDTO;
}
