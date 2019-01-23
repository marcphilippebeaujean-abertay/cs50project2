import Controller from '../interfaces/controller';
import UserViewUpdater from './userViewUpdater';
import UserViewModel from './userViewModel';
import SocketController from './socketManager';
import { formToJSON } from '../formUtilities';

export default class UserViewController extends Controller{
    constructor(){
        super(new UserViewUpdater(), new UserViewModel());

        this.onAddChatroomAttempt = this.onAddChatroomAttempt.bind(this);
        this.responseCallback = this.responseCallback.bind(this);
        this.onChatroomOpened = this.onChatroomOpened.bind(this);
        this.dispatchMessage = this.dispatchMessage.bind(this);
        this.getRoomInfo = this.getRoomInfo.bind(this);

        this.model.responseCallback = this.responseCallback;
        this.currentChatroom = {
            'roomName': ''
        };
    }
    initController(){
        const addChatroomForm = document.getElementsByClassName('add-chatroom-form')[0];
        if(addChatroomForm === undefined){
            // Couldn't find add chat room button - that means this controller
            // was not meant to be used for the given view
            return;
        }
        // Initialises chatrooms and other user info
        this.model.dispatchUserInfoRequest();
        addChatroomForm.addEventListener(
            'submit',
            this.onAddChatroomAttempt);
        const toggleChatroomMenuBtns = document.getElementsByClassName('toggle-add-chatroom-window');
        Array.from(toggleChatroomMenuBtns).forEach((element) => {
            element.addEventListener(
                'click',
                this.view.toggleChatroomAddWindow);
        });
        const messageSend = document.getElementById('chat-msg-form');
        messageSend.addEventListener(
            'submit',
            this.dispatchMessage);
    }
    onAddChatroomAttempt(e){
        e.preventDefault();
        this.model.dispatchAddChatroomRequest({
            ...formToJSON('add-chatroom-form')})
    }
    getRoomInfo(){ return this.currentChatroom; }
    responseCallback(responseMessage){
        switch(responseMessage['form']){
            case 'addChatRoom':
                this.view.setMessageForAddChatroom(responseMessage['respMessage'], responseMessage['success']);
                if (responseMessage['success']) {
                    // Add new chatroom to list
                    this.view.addChatroomBtn(responseMessage['room']);
                    if(this.currentChatroom['roomName'] === '') {
                        this.view.changeChatroom(responseMessage['room']);
                        this.onChatroomOpened(responseMessage['room']);
                    }
                }
                break;
            case 'getChatrooms':
                const chatrooms = responseMessage['chatrooms'];
                if(chatrooms.length > 0) {
                    chatrooms.forEach(chatroom => {
                        this.view.addChatroomBtn(chatroom, this.onChatroomOpened);
                    });
                    this.onChatroomOpened(chatrooms[0]);
                }
                // Initialise view after chatrooms have been
                // queried from the backend
                this.view.initChatroomView();
                break;
            case 'getUserInfo':
                if(('redirect' in responseMessage)){
                    window.location.href = responseMessage.redirect;
                }else{
                    this.userInfo = {
                        'username': responseMessage['username'],
                        'userid': responseMessage['userid']
                    };
                    this.model.dispatchChatroomListRequest();
                    this.socketController = new SocketController(
                        this.userInfo,
                        this.getRoomInfo,
                        this.view);
                    this.socketController.initSocket();
                }
                break;
            case 'getRoomMessages':
                responseMessage['messages'].forEach( msg => {
                   this.view.addMessageToView({
                       ...msg,
                       'fromCurrentUser': msg['username'] === this.userInfo.username
                   });
                });
                break;
            default:
                console.log('weird response form');
        }
    }
    onChatroomOpened(chatroomInfo){
        if(this.currentChatroom['roomName'] === chatroomInfo['roomName']){
            return;
        }
        this.currentChatroom = chatroomInfo;
        this.view.changeChatroom(chatroomInfo);
        this.model.dispatchGetMessagesRequest(chatroomInfo['roomId']);
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