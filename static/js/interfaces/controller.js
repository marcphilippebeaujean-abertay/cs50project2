export default class Controller{
    constructor(view, model){
        this.handleResponse = this.handleResponse.bind(this);

        this.view = view;
        this.model = model;
        this.model.responseCallback = this.handleResponse;
    }
    handleResponse(respData){
        throw 'handle response not defined'
    }
}