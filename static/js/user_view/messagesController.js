import Controller from '../interfaces/controller'
import MessagesView from './messagesView';
import MessagesModel from './messagesModel';

export default class MessagesController extends Controller{
    constructor(userInfo){
        super(new MessagesView(), new MessagesModel());

        this.userInfo = userInfo;

        this.dispatchMessage = this.dispatchMessage.bind(this);
        const messageSend = document.getElementById('chat-msg-form');
        if(messageSend === undefined){
            return;
        }
        messageSend.addEventListener(
            'submit',
            this.dispatchMessage);
    }
    dispatchMessage(e){
        e.preventDefault();
        //if(this.currentChatroom['roomName'] === ''){
        //    return;
        //}
        const msg = document.getElementById('chat-msg-area').value;
        if(msg.length === 0){
            return;
        }
    }
    handleResponse(responseMessage) {
        if(('redirect' in responseMessage)) {
            window.location.href = responseMessage.redirect;
        }
        switch(responseMessage['type']) {
            case 'getRoomMessages':
                responseMessage['messages'].forEach( msg => {
                   this.view.addMessageToView({
                       ...msg,
                       'isPending': false,
                       'fromCurrentUser': msg['username'] === this.userInfo.username
                   });
                });
                break;
            default:
                console.log('weird response message type');
                break;
        }
    }
}