import Model from '../interfaces/model';

export default class ChatroomsModel extends Model{
    constructor(responseCallback){
        super(responseCallback);

        this.chatroomNameReg = new RegExp(
    /^[a-zA-Z]{3,}$/g
        );
        this.dispatchAddChatroomRequest = this.dispatchAddChatroomRequest.bind(this);
        this.dispatchUserInfoRequest = this.dispatchUserInfoRequest.bind(this);
        this.dispatchRoomDeletionRequest = this.dispatchRoomDeletionRequest.bind(this);
    }
    dispatchAddChatroomRequest(formInput){
        console.log(formInput);
        if(!this.chatroomNameReg.test(formInput['roomName'])){
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
    dispatchRoomDeletionRequest(roomInfo){
        const request = this.initXMLHttpReq('deleteRoom');
        request.open('DELETE', '/delete_room');
        const data = new FormData();
        data.append('roomId', roomInfo['roomId']);
        data.append('ownerId', roomInfo['ownerId']);
        data.append('roomName', roomInfo['roomName']);
        request.send(data);
    }
}