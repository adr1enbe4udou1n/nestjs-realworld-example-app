import { Injectable, CanActivate, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return this.userService.isAuthenticated;
  }
}
