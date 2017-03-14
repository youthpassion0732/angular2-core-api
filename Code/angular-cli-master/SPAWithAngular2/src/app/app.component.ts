import { Component, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart } from '@angular/router';

import { UserService } from './users/shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'SPAWithAngular2';
  description = 'Welcome To SPA With Angular 2.0';
  userLoggedIn = false;
  userFullName: string = "";

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.userLoggedIn = this.userService.loggedIn();
      this.userFullName = sessionStorage.getItem("profile");
    }
  }

  logout() {
    this.userService.logoutUser();
    this.userLoggedIn = false;
    this.router.navigate(['/user-login']);
  }

  ngOnInit(): void {
    this.userLoggedIn = this.userService.loggedIn();
  }
}
