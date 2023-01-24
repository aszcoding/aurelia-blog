import { config } from "../../../../AppData/Local/Microsoft/TypeScript/4.9/node_modules/rxjs/index";
import { EventAggregator } from 'aurelia-event-aggregator';
import * as toastr from 'toastr';
import { PLATFORM, inject } from "aurelia-framework";
import { AuthService } from "./common/services/auth-service";
import { PostService } from './common/services/post-service';
import { AuthorizeStep } from "./pipeline-steps/authorize-step";


@inject (EventAggregator, AuthService, PostService)
export class App {

  constructor(EventAggregator, AuthService, PostService) {
    this.ea = EventAggregator;
    this.authService = AuthService;
    this.postService = PostService;
  }

  attached() {
    this.currentUser = this.authService.currentUser;
    this.subscription = this.ea.subscribe('user', user => {
      this.currentUser = this.authService.currentUser;
    });

    this.updateSidebar();
    this.postSubscription = this.ea.subscribe('post-updated', updatedAt =>{
      this.updateSidebar();
    })

    this.toastSubscription = this.ea.subscribe('toast', toast => {
      toastr[toast.type](toast.message);
    })
  }

  updateSidebar(){
    this.postService.allTags().then(data => {
      this.tags = data.tags
    }).catch(error => {
      this.ea.publish('toast', {
        type: 'error',
        message: error.message
      });
    })
    this.postService.allArchives().then(data => {
      this.archives = data.archives
    }).catch(error => {
      this.ea.publish('toast', {
        type: 'error',
        message: error.message
      });
    })
  }

  configureRouter(config, router) {
    this.router = router
    config.title = 'My Aurelia Blog'
    config.addAuthorizeStep(AuthorizeStep);
    config.map([
      { route: '', name: 'home', moduleId: PLATFORM.moduleName("posts/index"), title: 'All Posts'},
      { route: 'login', name: 'login', moduleId: PLATFORM.moduleName("auth/login"), title: 'Log In'},
      { route: 'signup', name: 'signup', moduleId: PLATFORM.moduleName("auth/signup"), title: 'Sign Up'},
      { route: 'create-post', name: 'create-post', moduleId: PLATFORM.moduleName("posts/create"), title: 'Create Post', settings: { auth: true}},
      { route: 'post/:slug/edit', name: 'post-edit', moduleId: PLATFORM.moduleName("posts/edit"), title: 'Edit Post', settings: { auth: true}},
      { route: 'post/:slug', name: 'post-view', moduleId: PLATFORM.moduleName("posts/view"), title: 'View Post'},
      { route: 'tag/:tag', name: 'tag-view', moduleId: PLATFORM.moduleName("posts/tag-view"), title: 'View Posts by Tag'},
      { route: 'archive/:archive', name: 'archive-view', moduleId: PLATFORM.moduleName("posts/archive-view"), title: 'View Posts by Archive'}
    ])
  }

  detached() {
    this.subscription.dispose();
    this.postSubscription.dispose();
    this.toastSubscription.dispose();
  }

  logout() {
    this.authService.logout().then(data => {
      this.ea.publish('user', null);
      this.ea.publish('toast', {
        type: 'success',
        message: 'You have successfully logged out.'
      });
      this.router.navigateToRoute('home'); //returns user to home page when they logout
    }).catch(error => {
      this.ea.publish('toast', {
        type: 'error',
        message: error.message
      });
    });
  }
}

