import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty()
  email: string;
}

export class UpdateUserCommand {
  @ApiProperty()
  user: UpdateUserDTO;
}
