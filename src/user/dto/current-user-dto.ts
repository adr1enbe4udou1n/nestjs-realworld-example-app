export class UserDTO {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  token: string;
}

export class UserEnvelope {
  user: UserDTO;
}