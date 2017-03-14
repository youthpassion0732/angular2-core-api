import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from "rxjs/Rx";

import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent {
    model = new User();
    errorMessage: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService
    ) { }

    onSubmit(): void {
        this.loginUser();
    }

    loginUser(): void {
        this.route.params
            .switchMap((params: Params) => this.userService.loginUser(this.model.email, this.model.passwordHash))
            .subscribe(response => {
                if (response && response.State == 1) {
                    this.router.navigate(['/user-list']);
                }
                else {
                    this.errorMessage = response.Msg;
                }
            },
            error => {
                this.errorMessage = "Error occurred during user login. Error=" + error;
            }
        );
    }

}