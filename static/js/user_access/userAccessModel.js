const validateFormInput = (formInput) => {
    if(!('email' in formInput)){
        throw 'email not added to form';
    }
    if(!('password' in formInput)){
        throw 'password not added to form';
    }
};

export default class UserAccessModel{
    constructor() {
        this.responseHandleCallback = null;

        this.initXMLHttpReq = this.initXMLHttpReq.bind(this);
        this.makeRegistrationRequest = this.makeRegistrationRequest.bind(this);
        this.makeLoginRequest = this.makeLoginRequest.bind(this);
    }
    initXMLHttpReq(){
        if(this.responseHandleCallback === null){
            throw 'Response handle callback undefined!';
        }
        const request = new XMLHttpRequest();
        request.timeout = 2000;
        request.onerror = () => {
            this.responseHandleCallback({
                'success': false,
                'respMessage': 'Failed to dispatch request!'
            });
        };
        request.ontimeout = (e) => {
            this.responseHandleCallback({
                'success': false,
                'respMessage': 'Request timed out!'
            });
        };
        request.onload = () => {
            console.log(JSON.parse((request.responseText)));
            this.responseHandleCallback(JSON.parse(request.responseText));
        };
        return request
    }
    makeRegistrationRequest(formInput){
        validateFormInput(formInput);
        const request = this.initXMLHttpReq();
        request.open('POST', '/add_user');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(`name=${formInput['username']}&password=${formInput['password']}&email=${formInput['email']}`);
    }
    makeLoginRequest(formInput){
        validateFormInput(formInput);
        const request = this.initXMLHttpReq();
        request.open('POST', '/login_user');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(`email=${formInput['email']}&password=${formInput['password']}`);
    }
}