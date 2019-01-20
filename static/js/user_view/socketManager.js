import './userViewUpdater';

export default class SocketController{
    constructor(userid, getRoomCallback, view){
        this.userid = userid;
        this.getRoomInfo = getRoomCallback;
        this.view = view;
        this.pendingMsgs = new Map();
    }
    initSocket(){
        // Connect to server websocket
        this.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
        if(this.getRoomInfo === null){
            throw '"getRoomInfo" callback not defined';
        }
        document.getElementById('chat-msg-form').addEventListener(
            'submit',
            (e) => {
                e.preventDefault();
                const roomInfo = this.getRoomInfo();
                if(roomInfo['roomName'] === ''){
                    return;
                }
                const chatMsg = document.getElementById('chat-msg-area').value;
                document.getElementById('chat-msg-area').value = "";
                if(chatMsg !== ''){
                    let uniqueKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    while(this.pendingMsgs.has(uniqueKey)){
                        uniqueKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    }
                    const msg = {
                        'userid': this.userid,
                        'roomName': roomInfo['roomId'],
                        'message': chatMsg,
                        'pendingId': uniqueKey,
                        'isPending': true
                    };
                    this.socket.emit('post message', msg);
                    this.pendingMsgs.set(uniqueKey, true);
                    this.view.addMessageToView(msg);
                }
            });
        this.socket.on('server message callback', data => {
            console.log('recieved confirmation that server got message');
            if(data['userid'] === this.userid){
            }
        });
    }

}