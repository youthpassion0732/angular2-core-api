import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/switchMap';

import { Post } from '../shared/post';
import { PostService } from '../shared/post.service';

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit {
    posts: Post[];
    selectedPost: Post;
    totalPosts: number;
    gridLoaded: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private postService: PostService
    ) { }

    getPosts(): void {
        this.route.params
            .switchMap((params: Params) => this.postService.getPosts())
            .subscribe(posts => {
                this.posts = posts;
                this.totalPosts = this.posts.length;
                this.gridLoaded = true;
        });
    }

    ngOnInit(): void {
        this.getPosts();
    }

    onSelect(post: Post): void {
        this.selectedPost = post;
        console.log("popup opened for id=" + this.selectedPost.id);
    }

    deletePost(): void {
        this.route.params
            .switchMap((params: Params) => this.postService.deletePost(this.selectedPost.id))
            .subscribe(isDeleted => {
                if (isDeleted) {
                    this.posts.splice(this.posts.indexOf(this.selectedPost), 1);
                    this.totalPosts = this.posts.length;
                    console.log("post deleted for id=" + this.selectedPost.id);
                }
                else {
                    Observable.throw("Error occurred during deletion of post.");
                }
            },
            error => {
                console.error("Error occurred during deletion of post. Error=" + error);
            }
        );
    }

}