export default class SocketManager{
    constructor(username, getRoomCallback){
        this.getRoomInfo = getRoomCallback;
        this.userName = username;
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
                console.log('sending msg');
                const roomInfo = this.getRoomInfo();
                if(roomInfo['roomName'] === ''){
                    return;
                }
                const chatMsg = document.getElementById('chat-msg-area').value;
                if(chatMsg !== ''){
                    this.socket.emit('new message', {
                        'username': this.userName,
                        'roomName': roomInfo['roomName'],
                        'message': chatMsg
                    });
                }
            });
    }

}