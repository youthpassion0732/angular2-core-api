import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './app.authGuard.service';

import { PostFormComponent } from './posts/post-form/post-form.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';

import { UserListComponent } from './users/user-list/user-list.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';
import { UserLoginComponent } from './users/user-login/user-login.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/post-list',
        pathMatch: 'full'
    },
    {
        path: 'post-new',
        component: PostFormComponent
    },
    {
        path: 'post-edit/:id',
        component: PostFormComponent
    },
    {
        path: 'post-list',
        component: PostListComponent
    },
    {
        path: 'post-detail/:id',
        component: PostDetailComponent
    },
    {
        path: 'user-list',
        component: UserListComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'user-register',
        component: UserRegisterComponent
    },
    {
        path: 'user-login',
        component: UserLoginComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuardService]
})
export class AppRoutingModule { }