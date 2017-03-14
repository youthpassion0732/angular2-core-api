import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { PostFormComponent } from './post-form/post-form.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostService } from './shared/post.service';
import { GenericService } from '../app.generic.service';

@NgModule({
    declarations: [
        PostFormComponent,
        PostListComponent,
        PostDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        RouterModule
    ],
    providers: [PostService, GenericService],
    exports: [
        PostFormComponent,
        PostListComponent,
        PostDetailComponent
    ]
})
export class PostsModule { }