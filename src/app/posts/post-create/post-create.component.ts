// this is the first file created but every ts component needs a html n css component too

import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormsModule } from "@angular/forms";
import { ActivatedRoute, ParamMap, UrlCreationOptions } from "@angular/router";
import { refCount, Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";


// this is how to import the html n css into the ts component
// and the selector is for letting the app know to pick this particular file
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {

  // enteredTitle and enteredContent are var/const/let but angular doesnt need those keys
  // they are initially empty but calling it on an (on) method we can add value or string to it
  enteredTitle = "";
  enteredContent = "";
  // this is imported from the post model to actually know what or define what information the post holds
  post: Post;
  // is loading by default is set to false, events can be hooked on is loading
  isLoading = false;
  // formgroup is coming from inbuilt angular Forms, trying to make the form reactive
  form: FormGroup;
  // for the image picked
  imagePreview: string;
  private mode = "create";
  // extracting the post id, which is a type string but by default its undefined
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    // activated route actually specifies the kind of route we r accessing, holds information about
    // the route we r on
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // ngOninit is the first service ran after the class is called on
  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
      // this is for Validators
      // validators is also imported from above
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      // control validator for image uploaded
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    // checking if the paramMap has postId, remember that activated route gives us all information
    // about the route we r hitting
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        
        // as stated above we r not on create here but edit
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        // is loading here is set to true so the event hooked can refCount, crosscheck with html
        this.isLoading = true;
        // using the post model to take in default values of the post we want to edit
        this.postsService.getPost(this.postId).subscribe(postData => {
          // after we r done editing we set it back to false
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          // continued from form validators, when editing a post, the initial values will not be null
          // but the previous entires will be set
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    // this event is called when a file is uploaded, the files comes as an array but the first one is picked
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    // the line below will run validity for the image picked
    this.form.get("image").updateValueAndValidity();
    // the code is for angular processing the image upload and previewing it
    const reader = new FileReader();
    // on loading the image, read the result as Url (file)
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  // using on save post so that it covers the add(save) and edit(save)
  onSavePost() {
    // if the required in the input is not fulfilled this will not allow any post to be saved
    if (this.form.invalid) {
      return;
    }
    // this is for the effect of the mat spinner
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
