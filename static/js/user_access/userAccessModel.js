import { formToJSON } from "../formUtilities";

export default class UserAccessModel{
    constructor() {
        this.formId = 'sign-form';
        this.queryFormData = this.queryFormData.bind(this);
    }
    queryFormData(){
        let data = formToJSON(this.formId);
        return data;
    }
    makeRegistrationRequest(formInput, callback){
        const request = new XMLHttpRequest();
        request.open('POST', '/add_user');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(`name=${formInput['username']}&password=${formInput['password']}&email=${formInput['email']}`);
        request.onload = ()=> {
            callback(JSON.parse(request.responseText));
        }
    }

}