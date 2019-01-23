const chatroomNameReg = new RegExp(
    /^[a-zA-Z]{3,}$/g
);

export default class UserViewModel{
    constructor(){
        this.responseCallback = null;
        this.dispatchAddChatroomRequest = this.dispatchAddChatroomRequest.bind(this);
        this.initXMLHttpReq = this.initXMLHttpReq.bind(this);
        this.dispatchUserInfoRequest = this.dispatchUserInfoRequest.bind(this);
        this.dispatchRoomDeletionRequest = this.dispatchRoomDeletionRequest.bind(this);
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
            this.responseCallback({
                'form': form,
                ...JSON.parse(request.responseText)
            });
        };
        return request
    }
    dispatchAddChatroomRequest(formInput){
        if(!chatroomNameReg.test(formInput['roomName'])){
            this.responseCallback({
                'form': 'addChatRoom',
                'success': false,
                'respMessage': 'Room name can only be 5 to 19 alphabetical characters'
            });
        }else{
            const request = this.initXMLHttpReq('addChatRoom');
            if(formInput['roomCreationChoice'] === 'create') {
                console.log(formInput);
                request.open('POST', '/add_chatroom');
                const data = new FormData();
                data.append('roomName', formInput['roomName']);
                request.send(data);
            }
        }
    }
    dispatchChatroomListRequest(){
        const request = this.initXMLHttpReq('getChatrooms');
        request.open('GET', '/get_chatrooms');
        // Send request
        request.send();
    }
    dispatchUserInfoRequest(){
        const request = this.initXMLHttpReq('getUserInfo');
        request.open('GET', '/get_user_info');
        request.send();
    }
    dispatchGetMessagesRequest(roomId){
        const request = this.initXMLHttpReq('getRoomMessages');
        request.open('POST', '/get_room_msgs');
        const data = new FormData();
        data.append('roomId', roomId);
        request.send(data);
    }
    dispatchRoomDeletionRequest(roomInfo){
        console.log(`Deleting room with room info ${roomInfo}`);
    }
}