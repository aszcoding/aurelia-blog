import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import { AuthService } from '../common/services/auth-service';

@inject(AuthService)
export class AuthorizeStep {

    constructor(AuthService) {
        this.authService = AuthService;
    }
  
    run(navigationInstruction, next) { //info we're getting from router configuration

        //If the user needs to be logged in, check for login
        if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
            //If the user is not logged in, send them to the log in page
            if(!this.authService.currentUser) {
                return next.cancel(new Redirect('login'));
            }
        }
        return next();
    }
}