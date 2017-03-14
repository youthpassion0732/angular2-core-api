import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { UserService } from './users/shared/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private userService: UserService,
        private router: Router) { }

    canActivate() {
        // If user is not logged in send his/her to the homepage 
        if (!this.userService.loggedIn()) {
            this.router.navigate(['/user-login']);
            return false;
        }
        return true;
    }
}