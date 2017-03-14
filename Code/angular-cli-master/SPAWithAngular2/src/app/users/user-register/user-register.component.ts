import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from "rxjs/Rx";

import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
    selector: 'user-register',
    templateUrl: './user-register.component.html',
    styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent {
    model = new User();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService
    ) { }

    onSubmit(): void {
        this.saveUser();
    }

    saveUser(): void {
        this.route.params
            .switchMap((params: Params) => this.userService.saveUser(this.model))
            .subscribe(userId => {
                this.model.id = userId;
                if (this.model.id != null && this.model.id != "") {
                    console.log("user registered successfully with id=" + this.model.id);
                    this.router.navigate(['/user-login']);
                }
                else {
                    Observable.throw("Error occurred during registeration of new user.");
                }
            },
            error => {
                console.error("Error occurred during registeration of new user. Error=" + error);
            }
        );
    }

}