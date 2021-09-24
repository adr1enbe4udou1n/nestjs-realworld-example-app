import { AutoMap } from '@automapper/classes';

export class CurrentUserDTO {
  @AutoMap()
  email: string;

  username: string;

  @AutoMap()
  bio?: string;

  @AutoMap()
  image?: string;

  token: string;
}

export class UserEnvelope {
  user: CurrentUserDTO;
}
