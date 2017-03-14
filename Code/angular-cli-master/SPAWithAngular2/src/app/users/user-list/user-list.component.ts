import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/switchMap';

import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
    users: User[];
    selectedUser: User;
    totalUsers: number;
    gridLoaded: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ) { }

    getUsers(): void {
        this.route.params
            .switchMap((params: Params) => this.userService.getUsers())
            .subscribe(users => {
                this.users = users;
                this.totalUsers = this.users.length;
                this.gridLoaded = true;
        });
    }

    ngOnInit(): void {
        this.getUsers();
    }

    onSelect(user: User): void {
        this.selectedUser = user;
        console.log("popup opened for id=" + this.selectedUser.id);
    }

    deleteUser(): void {
        this.route.params
            .switchMap((params: Params) => this.userService.deleteUser(this.selectedUser.id))
            .subscribe(isDeleted => {
                if (isDeleted) {
                    this.users.splice(this.users.indexOf(this.selectedUser), 1);
                    this.totalUsers = this.users.length;
                    console.log("user deleted for id=" + this.selectedUser.id);
                }
                else {
                    Observable.throw("Error occurred during deletion of user.");
                }
            },
            error => {
                console.error("Error occurred during deletion of user. Error=" + error);
            }
        );
    }

}