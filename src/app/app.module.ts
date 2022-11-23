import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

// connecting our angular to the backend, so any time a http is called it fetches data from the backend
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// importing other files
// always remember to import every component created
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
// AngularMaterialModule is like an extension of this file
import { AngularMaterialModule } from "./angular-material.module";
import { PostsModule } from "./posts/posts.module";
import { PostCreateComponent } from "./posts/post-create/post-create.component";

@NgModule({
  // letting angular know it has children files and display them or uses them
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule
  ],
  // providers are for services, more like controllers from the mern stack
  //in the providers are interceptors which are run at the start
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  // letting angular know of its chldren element the errorComponent
  entryComponents: [ErrorComponent]
})
export class AppModule {}
