import View from "../interfaces/view";

class UserAccessView extends View {
    constructor(){
        super();
    }
    initView() {
        this.errorDiv = document.querySelector('#log-error');
        if(this.errorDiv != null) {
            this.errorDiv.style.display = 'none';
        }
        this.email = document.querySelector('#email');
        this.password = document.querySelector('#passwordInput');
        this.confirmPassword = document.querySelector('#confirmPassword');
    };

    //updateView(data) {
    //    super.updateView(data);
    //    switch(data['update_type']){
    //        case 'Error':
    //    }
    //}
};

export default UserAccessView;