import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PostService} from '../common/services/post-service';

@inject (EventAggregator, PostService)
export class Index {

  constructor(EventAggregator, PostService) {
    this.ea = EventAggregator;
    this.postService = PostService;
  }

  attached() {
    this.postService.allPostPreviews().then(data => {
        this.posts = data.posts})
        .catch(error => {
          this.ea.publish('toast', {
            type: 'error',
            message: error.message
          })
        })
      }
}