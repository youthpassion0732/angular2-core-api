import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { GenericService } from 'app/app.generic.service';
import { Post } from './post'

@Injectable()
export class PostService {

    constructor(
        private http: Http,
        private genericService: GenericService
    ) { }

    getPosts() {
        return this.genericService.getAll(`http://localhost:62147/api/posts`)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    getPost(id: number) {
        return this.genericService.getSingle(`http://localhost:62147/api/posts/`, id)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    savePost(post: Post) {
        return this.genericService.post(`http://localhost:62147/api/posts/`, post)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    updatePost(post: Post) {
        return this.genericService.update(`http://localhost:62147/api/posts/`, post.id, post)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }

    deletePost(id: number) {
        return this.genericService.delete(`http://localhost:62147/api/posts/`, id)
            .map((res: Response) => res.json())
            .catch((err) => {
                return Observable.throw(err)
        });
    }
}