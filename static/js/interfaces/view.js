export default class View{
    constructor(){
        this.updateView = this.updateView.bind(this);
    }
    // Create invocation for commands when view is updated
    updateView(data) {
        if (!('updateType' in data)){
            throw 'update type type not defined when updating view';
        }
    }
}