import './chatroomsView';
import { getLocalUserInformation, getLocalRoomInformation } from "../localStorage";

export default class SocketController{
    constructor(view){
        this.userinfo = getLocalUserInformation();
        this.view = view;

        // Connect to server websocket
        this.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
        if(this.getRoomInfo === null){
            throw '"getRoomInfo" callback not defined';
        }
        document.getElementById('chat-msg-form').addEventListener(
            'submit',
            (e) => {
                e.preventDefault();
                const roomInfo = getLocalRoomInformation();
                if(roomInfo['roomName'] === ''){
                    return;
                }
                const chatMsg = document.getElementById('chat-msg-area').value;
                const uniqueKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                document.getElementById('chat-msg-area').value = "";
                if(chatMsg !== ''){
                    const ts = new Date();
                    const msg = {
                        'userid': this.userinfo['userid'],
                        'username': this.userinfo['username'],
                        'roomId': roomInfo['roomId'],
                        'roomName': roomInfo['roomName'],
                        'message': chatMsg,
                        'pendingId': uniqueKey,
                        'timestamp': ts.getTime()
                    };
                    this.socket.emit('post message', msg);
                    this.view.addMessageToView({
                        ...msg,
                        'isPending': true,
                        'fromCurrentUser': true
                    });
                }
            });
        this.socket.on('server message callback', data => {
            console.log("recieved message from user");
            if(data['userid'] === this.userinfo['userid']) {
                this.view.confirmMessage(data);
            }else{
                console.log("recieved message from other user");
                this.view.addMessageToView({
                    ...data,
                    'fromCurrentUser': false
                })
            }
        });
    }
}
