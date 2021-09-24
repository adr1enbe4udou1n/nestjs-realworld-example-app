export class CurrentUserDTO {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  token: string;
}

export class UserEnvelope {
  user: CurrentUserDTO;
}
