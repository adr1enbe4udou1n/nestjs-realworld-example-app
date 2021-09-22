import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginCommand {
  @ApiProperty()
  user: LoginDTO;
}
