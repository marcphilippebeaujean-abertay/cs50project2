export default class UserAccessView{
    constructor(){
        this.addErrorMsg = this.addErrorMsg.bind(this);
        this.addSuccessMsg = this.addSuccessMsg.bind(this);
        this.btnEnabled = true;
    }
    getFormErrorLog(){
        return document.getElementsByClassName('log-error')[0];
    }
    toggleSubmitButtonEnabled(){
        let btn = document.getElementsByClassName('btn')[0];
        if(btn === null){
            throw 'button not detected';
        }
        this.btnEnabled = !this.btnEnabled;
        if(this.btnEnabled){
            btn.removeAttribute('disabled');
        }else {
            btn.setAttribute('disabled', 'disabled');
        }
    }
    clearErrorMessages(){
        let errorElem = this.getFormErrorLog();
        errorElem.innerHTML = '';
        errorElem.style.display = 'none';
        console.log("clearing messages");
    }
    addErrorMsg(errorMessage) {
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
    addSuccessMsg(){
        const markup = `
            <div class="alert alert-success" role="alert">
                User has been registered!
            </div>`;
        this.getFormErrorLog().style = 'inline';
        this.getFormErrorLog().insertAdjacentHTML('beforeend', markup);
    }
};