import { ApiProperty } from '@nestjs/swagger';

export class NewCommentDTO {
  @ApiProperty()
  body: string;
}

export class NewCommentRequest {
  @ApiProperty()
  comment: NewCommentDTO;
}
