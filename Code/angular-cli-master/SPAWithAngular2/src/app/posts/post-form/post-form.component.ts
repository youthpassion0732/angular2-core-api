import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from "rxjs/Rx";

import { Post } from '../shared/post';
import { PostService } from '../shared/post.service';

@Component({
    selector: 'post-form',
    templateUrl: './post-form.component.html',
    styleUrls: ['./post-form.component.css']
})

export class PostFormComponent implements OnInit {
    model = new Post();
    pageTitle: string = "New Post";
    isNew = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private postService: PostService
    ) { }

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.postService.getPost(+params['id']))
            .subscribe(post => {
                this.model = post;
                if (this.model != null && this.model.id != null && this.model.id > 0) {
                    this.pageTitle = "Edit Post";
                    this.isNew = false;
                }
                else {
                    this.model = new Post();
                }
        });
    }

    onSubmit(): void {
        if (this.isNew) {
            this.savePost();
        }
        else {
            this.editPost();
        }
    }

    savePost(): void {
        this.route.params
            .switchMap((params: Params) => this.postService.savePost(this.model))
            .subscribe(postId => {
                this.model.id = postId;
                if (this.model.id != null && this.model.id > 0) {
                    console.log("post added successfully with id=" + this.model.id);
                    this.router.navigate(['/post-list']);
                }
                else {
                    Observable.throw("Error occurred during creation of new post.");
                }
            },
            error => {
                console.error("Error occurred during creation of new post. Error=" + error);
            }
        );
    }

    editPost(): void {
        this.route.params
            .switchMap((params: Params) => this.postService.updatePost(this.model))
            .subscribe(isUpdated => {
                if (isUpdated) {
                    console.log("post updated successfully.");
                    this.router.navigate(['/post-list']);
                }
                else {
                    Observable.throw("Error occurred during updation of post.");
                }
            },
            error => {
                console.error("Error occurred during updation of post. Error=" + error);
            }
        );
    }

}