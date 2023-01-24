import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {PostService} from '../common/services/post-service';
import { AuthService } from '../common/services/auth-service';

@inject (AuthService, EventAggregator, Router, PostService)
export class Edit {

  constructor(AuthService, EventAggregator, Router, PostService) {
    this.authService = AuthService;
    this.ea = EventAggregator;
    this.router = Router;
    this.postService = PostService;
  }

  activate(params){ //gets parameter, populates post, changes title to Edit Post
    this.postService.find(params.slug).then(data => {
      //Check authorized user to edit post = the current user
      if (data.post.author !== this.authService.currentUser) {
        this.router.navigateToRoute('home');
      }
      this.post = data.post;
    }).catch(error => {
      this.ea.publish('toast', {
        type: 'error',
        message: 'Post not found.'
      })
      this.router.navigateToRoute('home');
    });
    this.title = "Edit Post"
  }

  editPost() { //updates post that has been passed in
    this.postService.update(this.post).then(data => {
      this.ea.publish('post-updated', Date());
      this.ea.publish('toast', {
        type: 'success',
        message: 'Post Edited'
      })
      this.router.navigateToRoute('post-view', {slug: data.slug});
    }).catch(error => {
      this.ea.publish('toast', {
        type: 'error',
        message: error.message
      })
    })
  }
}
