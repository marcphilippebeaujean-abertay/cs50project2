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
        this.view.updateError('');
        if(document.getElementsByClassName(('sign-form')).length > 0) {
            document.getElementsByClassName('sign-form')[0].addEventListener('submit', this.onUserSubmission);
        }
    }
    onUserSubmission(event){
        event.preventDefault();
        let formInput = this.model.queryFormData();
        if(!emailRegex.test(formInput['email'])){
            this.view.updateError('Invalid email!');
            return;
        }
        if(formInput['password'].length < 6){
            this.view.updateError('Password too short!');
            return;
        }
        if(('passwordConfirmation' in formInput)){
            if(formInput['passwordConfirmation'] !== formInput['password']){
                this.view.updateError('Passwords mismatch!');
                return;
            }
            if(('username' in formInput)){
                if(!nameRegex.test(formInput['username'])){
                    this.view.updateError('Invalid username!');
                    return;
                }else{
                    // Passed all local tests for registering
                    const request = new XMLHttpRequest();
                    request.open('POST', '/add_user');
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    request.send(`name=${formInput['username']}&password=${formInput['password']}&email=${formInput['email']}`);
                    request.onload = ()=> {
                        const data = JSON.parse(request.responseText);
                    }
                }
            }
        }else{
            // Otherwise, this is a log in request

        }
    }
}