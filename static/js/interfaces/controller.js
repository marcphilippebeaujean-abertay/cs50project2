export default class Controller{
    constructor(){
        this.initController = this.initController.bind(this);

        document.addEventListener('DOMContentLoaded', () =>{
            this.initController();
        });
    }
    initController(){
        alert("controller initialisier not assigned");
    }
}