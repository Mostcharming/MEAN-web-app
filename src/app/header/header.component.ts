import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  // for the html file
  templateUrl: "./header.component.html",
  // for the css file
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  // loading this service the default value for userAuthenticatin is false until user is logged in
  // and issued a token stored in the browser
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  // injecting the authService into the header component
  constructor(private authService: AuthService) {}

  // this is the first service ran after the class is initiated
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  // connecting the logout button to the auth service n making sure the authStatus is false
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
