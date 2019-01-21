import './userViewUpdater';

export default class SocketController{
    constructor(userinfo, getRoomCallback, view){
        this.userinfo = userinfo;
        this.getRoomInfo = getRoomCallback;
        this.view = view;
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
                    const ts = new Date();
                    console.log(ts.getTime());
                    console.log(ts.getMonth());
                    let uniqueKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    const msg = {
                        'userid': this.userinfo['userid'],
                        'username': this.userinfo['username'],
                        'roomId': roomInfo['roomId'],
                        'message': chatMsg,
                        'pendingId': uniqueKey,
                        'isPending': true,
                        'timestamp': ts.getTime()
                    };
                    this.socket.emit('post message', msg);
                    this.view.addMessageToView({
                        ...msg,
                        'fromCurrentUser': true
                    });
                }
            });
        this.socket.on('server message callback', data => {
            if(data['userid'] == this.userinfo['userid']) {
                this.view.confirmMessage(data);
            }else{
                this.view.addMessageToView({
                    ...data,
                    'fromCurrentUser': false
                })
            }
        });
    }
}
