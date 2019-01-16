export default class UserAccessView{
    constructor(){
        this.updateError = this.updateError.bind(this);
    }
    clearErrorMessages(){
        let errorElem = document.getElementsByClassName('log-error')[0];
        errorElem.innerHTML = '';
        errorElem.style.display = 'none';
        console.log("clearing messages");
    }
    updateError(errorMessage) {
        let errorElem = document.getElementsByClassName('log-error')[0];
        errorElem.style.display = 'inline';
        if(errorElem === null){
            throw 'tried to throw error on element select';
            return;
        }
        if(errorMessage.length > 0) {
            const markup = `
            <div class="alert alert-danger" role="alert">
                ${errorMessage}
            </div>`;
            errorElem.insertAdjacentHTML('beforeend', markup);
        }
    }
};