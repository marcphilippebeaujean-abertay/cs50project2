import Model from '../interfaces/model'

export default class MessagesModel extends Model{
    constructor(){
        super();
        this.dispatchGetMessagesRequest = this.dispatchGetMessagesRequest.bind(this);
    }
    dispatchGetMessagesRequest(roomId){
        const request = this.initXMLHttpReq('getRoomMessages');
        request.open('POST', '/get_room_msgs');
        const data = new FormData();
        data.append('roomId', roomId);
        request.send(data);
    }
}