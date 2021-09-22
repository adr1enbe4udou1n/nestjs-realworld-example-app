import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;
}

export class RegisterCommand {
  @ApiProperty()
  user: RegisterDTO;
}
