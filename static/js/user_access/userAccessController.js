import Controller from "../interfaces/controller";
import UserAccessView from "./userAccessView";
import UserAccessModel from "./userAccessModel";

const emailRegex = new RegExp(
  /(?=.{7,})(?!.*[\s])(?!.*[A-Z])[a-z]+([.][a-z]+)?[@][\w]+[.][a-z]+([.][a-z]+)?$/
);
const nameRegex = new RegExp(/(?=.{6,})([A-Z][a-z]+[\s]?){2,}/);

export default class UserAccessController extends Controller{
    constructor(){
        super(new UserAccessView(), new UserAccessModel());

        this.onUserSubmission = this.onUserSubmission.bind(this);
    }
    initController() {
        this.view.updateView({
            'updateType': 'error',
            'errorMessage': ''
        });
        if(document.getElementsByClassName(('sign-form')).length > 0) {
            document.getElementsByClassName('sign-form')[0].addEventListener('submit', this.onUserSubmission);
        }
    }
    onUserSubmission(event){
        event.preventDefault();
        let formInput = this.model.queryModelData({
            'dataType': 'fieldInputs'
        });
        if(!emailRegex.test(formInput['email'])){
            this.view.updateView({
                'updateType': 'error',
                'errorMessage': 'Invalid email!'
            });
            return;
        }
        if(('passwordConfirmation' in formInput)){
            if(formInput['passwordConfirmation'] !== formInput['password']){
                this.view.updateView({
                    'updateType': 'error',
                    'errorMessage': 'Passwords mismatch!'
                });
                return;
            }
        }
        if(('username' in formInput)){
            if(!nameRegex.test(formInput['username'])){
                this.view.updateView({
                    'updateType': 'error',
                    'errorMessage': 'Invalid username!'
                });
                return;
            }
        }
        console.log(formInput);
    }
}