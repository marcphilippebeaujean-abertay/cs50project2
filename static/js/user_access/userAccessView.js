export default class UserAccessView{
    constructor(){
        this.updateError = this.updateError.bind(this);
    }
    updateError(errorMessage) {
        let errorElem = document.getElementsByClassName('log-error')[0];
        if(errorElem === null){
            throw 'tried to throw error on element select';
            return;
        }
        if(errorMessage.length === 0) {
            errorElem.style.display = 'none';
        }else {
            errorElem.style.display = 'block';
            errorElem.innerHTML = errorMessage;
        }
    }
};