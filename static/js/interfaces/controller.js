export default class Controller{
    constructor(view, model){
        this.view = view;
        this.model = model;
        this.initController = this.initController.bind(this);

        document.addEventListener('DOMContentLoaded', () =>{
            this.initController();
        });
    }
    initController(){
        throw 'controller initialisier not assigned';
    }
}