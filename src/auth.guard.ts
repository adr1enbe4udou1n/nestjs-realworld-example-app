import { Injectable, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return this.userService.isAuthenticated;
  }
}