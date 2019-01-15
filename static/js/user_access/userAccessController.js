import Controller from "../interfaces/controller";
import UserAccessView from "./userAccessView";
import UserAccessModel from "./userAccessModel";

export default class UserAccessController extends Controller{
    constructor(){
        super();
        this.view = new UserAccessView();
        this.model = new UserAccessModel();

        this.onUserSubmission = this.onUserSubmission.bind(this);
    }
    initController() {
        this.view.updateView({
            'updateType': 'errorUpdate',
            'showError': false
        });
        if(document.getElementsByClassName(('sign-form')).length > 0) {
            console.log("binding on submit event");
            document.getElementsByClassName('sign-form')[0].addEventListener('submit', this.onUserSubmission);
        }
    }
    onUserSubmission(event){
        event.preventDefault();
        console.log('submission event initiated');
        let formInput = this.model.queryModelData({
            'dataType': 'fieldInputs'
        });
        console.log(formInput);
    }
}