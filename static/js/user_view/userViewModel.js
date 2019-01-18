const chatroomNameReg = new RegExp(
    /^[a-zA-Z]{3,}$/g
);

export default class UserViewModel{
    constructor(){
        this.responseCallback = null;
        this.dispatchAddChatroomRequest = this.dispatchAddChatroomRequest.bind(this);
        this.initXMLHttpReq = this.initXMLHttpReq.bind(this);
    }
    initXMLHttpReq(form){
        if(this.responseCallback === null){
            throw 'Response handle callback undefined!';
        }
        const request = new XMLHttpRequest();
        request.timeout = 2000;
        request.onerror = () => {
            this.responseCallback({
                'form': form,
                'success': false,
                'respMessage': 'Failed to dispatch request!'
            });
        };
        request.ontimeout = (e) => {
            this.responseCallback({
                'form': form,
                'success': false,
                'respMessage': 'Request timed out!'
            });
        };
        request.onload = () => {
            console.log(JSON.parse((request.responseText)));
            this.responseCallback(JSON.parse(request.responseText));
        };
        return request
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
        }else{
            //const request = this.initXMLHttpReq('addChatRoom');
            //if(formInput['roomCreationChoice'] === 'create') {
            //    request.open('POST', '/add_chatroom');
            //    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            //}
        }
    }
}