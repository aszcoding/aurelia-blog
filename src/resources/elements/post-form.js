import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationRules, ValidationControllerFactory, validationMessages} from 'aurelia-validation';
import {PostService} from '../../common/services/post-service';

@inject (ValidationControllerFactory, EventAggregator, PostService)
export class PostForm {
  @bindable post;
  @bindable title;

  constructor(ValidationControllerFactory, EventAggregator, PostService) {
    this.controller = ValidationControllerFactory.createForCurrentScope(); //creates a ValidationController for current scope
    this.ea = EventAggregator;
    this.postService = PostService;
  }

  attached() {
    this.postService.allTags().then(data => {
      this.allTags = data.tags;
    }).catch(error => {
      this.ea.publish('toast', {
        type: 'error',
        message: error.message
      })
    });
  }

  
  addTag(){
    this.allTags.push(this.newTag);
    this.post.tags.push(this.newTag);
    this.newTag = '';
  }

  submit(){

  }

  postChanged(newValue, oldValue) { //if post exists, ensure the post has a title
    if(this.post){

    validationMessages['required'] = `You must enter a \${$displayName}.`;

    ValidationRules
      .ensure('title').displayName('Title')
        .required()
        .minLength(5)
      .ensure('body').displayName('Body')
        .required()
        .minLength(25)
      .on(this.post);

    this.controller.validate();
  }
}}
