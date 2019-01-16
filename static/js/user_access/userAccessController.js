import Controller from "../interfaces/controller";
import UserAccessView from "./userAccessView";
import UserAccessModel from "./userAccessModel";
import {clearFormInput} from "../formUtilities";

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
        this.view.toggleSubmitButtonEnabled();
        let formInput = this.model.queryFormData();
        let formErrors = [];
        if(!emailRegex.test(formInput['email'])){
            formErrors.push('Invalid email!');
        }
        if(formInput['password'].length < 6){
            formErrors.push('Password too short!');
        }else if(formInput['password'].length > 20){
            formErrors.push('Password too long!');
        }
        // If password confirmation field exists, we are attempting
        // to register a user
        if(('passwordConfirmation' in formInput)){
            if(formInput['passwordConfirmation'] !== formInput['password']){
                formErrors.push('Passwords mismatch!');
            }
            if(('username' in formInput)) {
                if (!nameRegex.test(formInput['username'])) {
                    formErrors.push('Invalid username!');
                }
            }
            if(formErrors.length === 0){
                // Passed all local tests for registering
                // Dispatch request to register user
                this.model.makeRegistrationRequest(formInput, (respData) =>{
                    if(respData['success']){
                        this.view.displayRegistrationSuccess();
                    }else{
                        this.view.updateError(respData['error']);
                    }
                    clearFormInput('sign-form');
                    this.view.toggleSubmitButtonEnabled();
                });
                return;
            }else{
                formErrors.forEach( error => this.view.updateError(error) );
            }
        }else{
            // Otherwise, this is a log in request
            if(formErrors.length === 0){

            }else{
                formErrors.forEach( error => this.view.updateError(error) );
            }
        }
        this.view.toggleSubmitButtonEnabled();
    }
}