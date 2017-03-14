import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserService } from './shared/user.service';
import { GenericService } from '../app.generic.service';

@NgModule({
    declarations: [
        UserListComponent,
        UserRegisterComponent,
        UserLoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        RouterModule
    ],
    providers: [UserService, GenericService],
    exports: [
        UserListComponent,
        UserRegisterComponent,
        UserLoginComponent
    ]
})
export class UsersModule { }