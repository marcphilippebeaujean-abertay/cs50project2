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
        if(this.currentChatroom['roomName'] === ''){
            return;
        }
        const msg = document.getElementById('chat-msg-area').value;
        if(msg.length === 0){
            return;
        }
    }
}