export default class Controller{
    constructor(view, model){
        this.handleResponse = this.handleResponse.bind(this);

        this.view = view;
        this.model = model;
        this.model.responseCallback = this.handleResponse;
        this.initController = this.initController.bind(this);

        document.addEventListener('DOMContentLoaded', () =>{
            this.initController();
        });
    }
    initController(){
        throw 'controller initialisation not defined';
    }
    handleResponse(respData){
        throw 'handle response not defined'
    }
}