import Model from '../interfaces/model';

const chatroomNameReg = new RegExp(
    /^[a-zA-Z]{3,}$/g
);

export default class UserViewModel extends Model{
    constructor(responseCallback){
        super(responseCallback);
        this.dispatchAddChatroomRequest = this.dispatchAddChatroomRequest.bind(this);
        this.dispatchUserInfoRequest = this.dispatchUserInfoRequest.bind(this);
        this.dispatchRoomDeletionRequest = this.dispatchRoomDeletionRequest.bind(this);
    }
    dispatchAddChatroomRequest(formInput){
        if(!chatroomNameReg.test(formInput['roomName'])){
            this.responseCallback({
                'type': 'addChatRoom',
                'success': false,
                'respMessage': 'Room name can only be 5 to 19 alphabetical characters'
            });
        }else{
            const request = this.initXMLHttpReq('addChatRoom');
            if(formInput['roomCreationChoice'] === 'create') {
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