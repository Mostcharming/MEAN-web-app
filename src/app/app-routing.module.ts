// this page is for routing
// first the homePage which will contain the post list
// 2nd we have the create Component
// 3rd the edit Component

// we can also put this file into the appModule but its good practise to split them

import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", component: PostListComponent },
  // authGuard is a service for protecting the create and edit routes
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  // for the edit route (editing a specific post connected to a single id(id of the post))
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}
  { path: "auth", loadChildren: async () => ( await import ('./auth/auth.module')).AuthModule}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // this is the best way of injecting authGuard, so angular knows and we can protect some routes with it
  providers: [AuthGuard]
})
export class AppRoutingModule {}
