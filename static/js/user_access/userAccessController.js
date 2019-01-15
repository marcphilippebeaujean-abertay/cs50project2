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
        if(document.getElementById('#sign-form') !== null) {
            document.getElementById('#sign-form').addEventListener('submit', this.onUserSubmission);
        }
    }
    onUserSubmission(event){
        event.preventDefault();
        let formInput = this.model.queryModelData({
            'dataType': 'fieldInputs'
        });
        console.log(formInput);
    }
}