export default class View{
    constructor(){
        this.initView = this.initView.bind(this);
        this.updateView = this.updateView.bind(this);

        document.addEventListener('DOMContentLoaded', () => {
                this.initView();
            });
    }
    initView() {
        alert('init view not defined');
    }
    // Create invocation for commands when view is updated
    updateView(data) {
        if (!('update_type' in data)){
            alert('update type not defined when updating view');
        }
    };
}