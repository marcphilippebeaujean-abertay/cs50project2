import View from "../interfaces/view";

class UserAccessView extends View {
    constructor(){
        super();
    }

    updateView(data) {
        super.updateView(data);
        switch(data['updateType']){
            case 'error':
                let errorElem = document.getElementsByClassName('log-error')[0];
                if(errorElem === null){
                    throw 'tried to throw error on element select';
                    return;
                }
                if(!('errorMessage' in data)){
                    throw 'forgot to add error message';
                    return;
                }
                if(data['errorMessage'].length === 0) {
                    errorElem.style.display = 'none';
                }else{
                    errorElem.style.display = 'block';
                    errorElem.innerHTML = `${data['errorMessage']}`;
                }
                break;
            default:
                throw 'strange view update for user access view';
                break;
        }
    }
};

export default UserAccessView;