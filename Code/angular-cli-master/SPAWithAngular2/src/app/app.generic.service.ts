import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Rx";

@Injectable()
export class GenericService {

    constructor(
        private http: Http
    ) { }

    setAuthHeader(isTokenBased: boolean) {
        let options = null;
        if (isTokenBased) {
            let token = sessionStorage.getItem("token");
            let headers = new Headers({ 'Authorization': 'Bearer ' + token });
            options = new RequestOptions({ headers: headers });
        }
        return options;
    }

    handleError(error: any) {
        console.log(error);
        if (error.statusText != null && error.statusText == "Unauthorized") {
            this.logout();
            window.location.href = "/user-login";
        }
        else {
            return Observable.throw(error);
        }
    }

    logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("profile");
    }

    checkLoggedIn() {
        let token = sessionStorage.getItem("token");
        if (token != null) {
            return true;
        }
        else {
            return false;
        }
    };

    getAll(url: string, isTokenBased: boolean = true) {
        return this.http.get(url, this.setAuthHeader(isTokenBased))
            .map((res: Response) => res)
            .catch((err) => {
                return this.handleError(err);
            });
    }

    getSingle(url: string, id: any, isTokenBased: boolean = true) {
        return this.http.get(url + id, this.setAuthHeader(isTokenBased))
            .map((res: Response) => res)
            .catch((err) => {
                return this.handleError(err);
            });
    }

    post(url: string, item: any, isTokenBased: boolean = true) {
        return this.http.post(url, item, this.setAuthHeader(isTokenBased))
            .map((res: Response) => res)
            .catch((err) => {
                return this.handleError(err);
            })
    }

    update(url: string, id: any, item: any, isTokenBased: boolean = true) {
        return this.http.put(url + id, item, this.setAuthHeader(isTokenBased))
            .map((res: Response) => res)
            .catch((err) => {
                return this.handleError(err);
            });
    }

    delete(url: string, id: any, isTokenBased: boolean = true) {
        return this.http.delete(url + id, this.setAuthHeader(isTokenBased))
            .map((res: Response) => res)
            .catch((err) => {
                return this.handleError(err);
            });
    }
}