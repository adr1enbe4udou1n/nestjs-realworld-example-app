import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserDTO } from './dto/current-user.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(
    req: Request & { user?: UserDTO & { id?: number } },
    res: Response,
    next: NextFunction,
  ) {
    const authHeaders = req.headers.authorization;
    console.log(authHeaders);
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];

      try {
        await this.userService.setUserFromToken(token);
      } catch {
        throw new HttpException(
          'Token no more valid.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      req.user = await this.userService.current();
      req.user.id = this.userService.user.id;
    }

    next();
  }
}
