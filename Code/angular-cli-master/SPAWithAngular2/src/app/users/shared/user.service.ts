import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';

import { GenericService } from 'app/app.generic.service';
import { User } from './user';

@Injectable()
export class UserService {
    user: User = null;

    constructor(
        private http: Http,
        private genericService: GenericService
    ) { }

    logoutUser() {
        this.genericService.logout();
    }

    loggedIn() {
        return this.genericService.checkLoggedIn();
    };

    loginUser(email: string, password: string) {
        this.user = new User();
        this.user.email = email;
        this.user.passwordHash = password;

        return this.genericService.post(`http://localhost:62147/api/tokenauth/`, this.user)
            .map(response => {
                var result = response.json();
                if (result.State == 1) {
                    var json = result.Data;
                    sessionStorage.setItem("token", json.accessToken);
                    sessionStorage.setItem("profile", json.fullName);
                }
                return result;
            })
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    getUsers() {
        return this.genericService.getAll(`http://localhost:62147/api/users`)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    getUser(id: string) {
        return this.genericService.getSingle(`http://localhost:62147/api/users/`, id)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    saveUser(user: User) {
        return this.genericService.post(`http://localhost:62147/api/users/`, user, false)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    updateUser(user: User) {
        return this.genericService.update(`http://localhost:62147/api/users/`, user.id, user)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    deleteUser(id: string) {
        return this.genericService.delete(`http://localhost:62147/api/users/`, id)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }
}