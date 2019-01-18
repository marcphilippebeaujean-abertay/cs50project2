const chatroomNameReg = new RegExp(
    /(?=.{5, 19})(?![\s])/
);

export default class UserViewModel{
    constructor(){
        this.responseCallback = null;
        this.dispatchAddChatroomRequest = this.dispatchAddChatroomRequest.bind(this);
    }

    dispatchAddChatroomRequest(formInput){
        if(this.responseCallback === null){
            throw 'response callback not defined';
        }
        if(!chatroomNameReg.test(formInput['roomName'])){
            this.responseCallback({
                'form': 'addChatRoom',
                'success': false,
                'message': 'Invalid room name (between 5 to 19 characters and no white space)'
            });
            return;
        }else{

        }
    }
}