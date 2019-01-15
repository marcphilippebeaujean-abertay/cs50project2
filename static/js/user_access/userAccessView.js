import View from "../interfaces/view";

class UserAccessView extends View {
    constructor(){
        super();
    }

    updateView(data) {
        super.updateView(data);
        switch(data['updateType']){
            case 'errorUpdate':
                let errorElem = document.getElementById('log-error');
                if(errorElem === null){
                    return;
                }
                if(data['showError'] === false) {
                    errorElem.style.display = 'none';
                }else{
                    errorElem.style.display = 'inline';
                }
            break;
        }
    }
};

export default UserAccessView;