export default class UserAccessModel{
    constructor() {
        this.responseHandleCallback = null;

        this.makeRegistrationRequest = this.makeRegistrationRequest.bind(this);
    }
    makeRegistrationRequest(formInput){
        if(this.responseHandleCallback === null){
            throw 'Response handle callback undefined!';
        }
        const request = new XMLHttpRequest();
        request.timeout = 2000;
        request.onerror = () => {
            console.log('error occured');
            this.responseHandleCallback({
                'success': false,
                'respMessage': 'Failed to dispatch request!'
            });
        };
        request.onload = () => {
            this.responseHandleCallback(JSON.parse(request.responseText));
        };
        request.ontimeout = (e) => {
            this.responseHandleCallback({
                'success': false,
                'respMessage': 'Request timed out!'
            });
        };
        request.open('POST', '/add_user');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(`name=${formInput['username']}&password=${formInput['password']}&email=${formInput['email']}`);
        return request;
    }

}