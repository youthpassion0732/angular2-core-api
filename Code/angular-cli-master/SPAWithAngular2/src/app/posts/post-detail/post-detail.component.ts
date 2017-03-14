import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Post } from '../shared/post';
import { PostService } from '../shared/post.service';

@Component({
    selector: 'post-detail',
    templateUrl: './post-detail.component.html',
    styleUrls: ['./post-detail.component.css']
})

export class PostDetailComponent implements OnInit {
    post: Post;

    constructor(
        private route: ActivatedRoute,
        private postService: PostService
    ) { }

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.postService.getPost(+params['id']))
            .subscribe(post => this.post = post);
    }
}