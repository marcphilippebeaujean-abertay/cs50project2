export default class UserAccessView{
    constructor(){
        this.updateError = this.updateError.bind(this);
    }
    getFormErrorLog(){
        return document.getElementsByClassName('log-error')[0];
    }
    clearErrorMessages(){
        let errorElem = this.getFormErrorLog();
        errorElem.innerHTML = '';
        errorElem.style.display = 'none';
        console.log("clearing messages");
    }
    updateError(errorMessage) {
        let errorElem = this.getFormErrorLog();
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
    displayRegistrationSuccess(){
        const markup = `
            <div class="alert alert-success" role="alert">
                User has been registered!
            </div>`;
        this.getFormErrorLog().style = 'inline';
        this.getFormErrorLog().insertAdjacentHTML('beforeend', markup);
    }
};