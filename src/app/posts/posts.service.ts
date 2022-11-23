// subscribe means a service wont be called on unless its subsscribed too
// this file processes all the services done by post

import { APP_INITIALIZER, Injectable } from "@angular/core";

// connecting our angular to the backend, so any time a http is called it fetches data from the backend
import { HttpClient } from "@angular/common/http";
import { Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

// injecting this service into the root angular core so it can be called easily by any file 
// that needs it
@Injectable({ providedIn: "root" })
export class PostsService {

  // adding private means you cant edit it from outside
  private posts: Post[] = [];
  // subject here is coming from rxjs and its allows values to be accessed by more than one and access
  // to all values under it
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  // for connecting to our api and binding to a private property
  // injecting the angular router in the constructor so it helps us with navigation
  //meaning it helps us change links other than adding links to the webApp
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // this is connecting the backend paginator to the front end pagonator
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )

      // this is a middleware function to basically map the data coming from the server to our own specified
      // data structure for example...id=_id
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map((post : any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      // subscribe brings the result of our new post from map and saves under transformedPost
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  // readOnly
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        // after the Subscription is done head back to the root page
        // Subscription here is adding a new post
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
