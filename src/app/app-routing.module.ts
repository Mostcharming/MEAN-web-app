

import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", component: PostListComponent },

  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },

  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}
  { path: "auth", loadChildren: async () => ( await import ('./auth/auth.module')).AuthModule}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

  providers: [AuthGuard]
})
export class AppRoutingModule {}
