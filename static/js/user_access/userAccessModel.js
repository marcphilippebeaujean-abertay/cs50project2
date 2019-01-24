import Model from '../interfaces/model';

const validateFormInput = (formInput) => {
    if(!('email' in formInput)){
        throw 'email not added to form';
    }
    if(!('password' in formInput)){
        throw 'password not added to form';
    }
};

export default class UserAccessModel extends Model{
    constructor() {
        super();
        this.makeRegistrationRequest = this.makeRegistrationRequest.bind(this);
        this.makeLoginRequest = this.makeLoginRequest.bind(this);
    }
    makeRegistrationRequest(formInput){
        validateFormInput(formInput);
        const request = this.initXMLHttpReq('addUser');
        request.open('POST', '/add_user');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(`name=${formInput['username']}&password=${formInput['password']}&email=${formInput['email']}`);
    }
    makeLoginRequest(formInput){
        validateFormInput(formInput);
        const request = this.initXMLHttpReq('logInUser');
        request.open('POST', '/login_user');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(`email=${formInput['email']}&password=${formInput['password']}`);
    }
}