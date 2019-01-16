import Controller from "../interfaces/controller";
import UserAccessView from "./userAccessView";
import UserAccessModel from "./userAccessModel";

const emailRegex = new RegExp(
  /(?=.{7,})(?!.*[\s])(?!.*[A-Z])[a-z]+([.][a-z]+)?[@][\w]+[.][a-z]+([.][a-z]+)?$/
);
const nameRegex = new RegExp(/(?=.{6,})(?!=[\s])/);

export default class UserAccessController extends Controller{
    constructor(){
        super(new UserAccessView(), new UserAccessModel());

        this.onUserSubmission = this.onUserSubmission.bind(this);
    }
    initController() {
        this.view.clearErrorMessages();
        if(document.getElementsByClassName(('sign-form')).length > 0) {
            document.getElementsByClassName('sign-form')[0].addEventListener('submit', this.onUserSubmission);
        }
    }
    onUserSubmission(event){
        event.preventDefault();
        this.view.clearErrorMessages();
        let formInput = this.model.queryFormData();
        if(!emailRegex.test(formInput['email'])){
            this.view.updateError('Invalid email!');
        }
        if(formInput['password'].length < 6){
            this.view.updateError('Password too short!');
        }else if(formInput['password'].length > 20){
            this.view.updateError('Password too long!');
        }
        if(('passwordConfirmation' in formInput)){
            if(formInput['passwordConfirmation'] !== formInput['password']){
                this.view.updateError('Passwords mismatch!');
            }
            if(('username' in formInput)){
                if(!nameRegex.test(formInput['username'])){
                    this.view.updateError('Invalid username!');
                }else{
                    // Passed all local tests for registering
                    // Dispatch request to register user
                    const response = this.model.makeRegistrationRequest(formInput);
                }
            }
        }else{
            // Otherwise, this is a log in request

        }
    }
}