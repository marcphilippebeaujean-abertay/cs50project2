import Controller from '../interfaces/controller';
import ChatroomsView from './chatroomsView';
import ChatroomsModel from './chatroomsModel';
import SocketController from './socketManager';
import { formToJSON } from '../formUtilities';

export default class ChatroomsController extends Controller{
    constructor(userInfo, roomSwitchCallback){
        super(new ChatroomsView(), new ChatroomsModel());

        this.onAddChatroomAttempt = this.onAddChatroomAttempt.bind(this);
        this.onChatroomOpened = this.onChatroomOpened.bind(this);
        this.getRoomInfo = this.getRoomInfo.bind(this);
        this.onChatroomRemoved = this.onChatroomRemoved.bind(this);
        this.initialiseRoom = this.initialiseRoom.bind(this);

        this.currentChatroom = {
            'roomName': ''
        };
        this.roomSwitchCallback = roomSwitchCallback;
        this.chatRooms = [];
        this.userInfo = userInfo;

        const addChatroomForm = document.getElementsByClassName('add-chatroom-form')[0];
        if(addChatroomForm === undefined){
            // Couldn't find add chat room button - that means this controller
            // was not meant to be used for the given view
            return;
        }
        // Initialises chatrooms and other user info
        addChatroomForm.addEventListener(
            'submit',
            this.onAddChatroomAttempt);
        const toggleChatroomMenuBtns = document.getElementsByClassName('toggle-add-chatroom-window');
        Array.from(toggleChatroomMenuBtns).forEach((element) => {
            element.addEventListener(
                'click',
                this.view.toggleChatroomAddWindow);
        });
        this.model.dispatchChatroomListRequest();
    }
    onAddChatroomAttempt(e){
        e.preventDefault();
        this.model.dispatchAddChatroomRequest({
            ...formToJSON('add-chatroom-form')})
    }
    getRoomInfo(){ return this.currentChatroom; }
    handleResponse(responseMessage){
        if(('redirect' in responseMessage)) {
            window.location.href = responseMessage.redirect;
        }
        switch(responseMessage['type']){
            case 'addChatRoom':
                this.view.setMessageForAddChatroom(responseMessage['respMessage'], responseMessage['success']);
                if (responseMessage['success']) {
                    // Add new chatroom to list
                    this.initialiseRoom(responseMessage['room']);
                    this.view.changeChatroom(responseMessage['room']);
                    this.onChatroomOpened(responseMessage['room']);
                    this.chatRooms.push(responseMessage['room']);
                }
                break;
            case 'getChatrooms':
                const chatrooms = responseMessage['chatrooms'];
                if(chatrooms.length > 0) {
                    this.chatRooms = chatrooms;
                    chatrooms.forEach(chatroom => {
                        this.initialiseRoom(chatroom);
                    });
                    this.onChatroomOpened(chatrooms[0]);
                }
                // Initialise view after chatrooms have been
                // queried from the backend
                this.view.initChatroomView();
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
        this.roomSwitchCallback(chatroomInfo['roomId']);
    }
    onChatroomRemoved(chatroomInfo){
        console.log('delete callback called');
    }
    initialiseRoom(roomInfo){
        let chatDeleteCallback = undefined;
        if(roomInfo['roomOwner'] === this.userInfo.userid){
            chatDeleteCallback = this.onChatroomRemoved;
        }
        this.view.addChatroomBtn(roomInfo, this.onChatroomOpened, chatDeleteCallback);
    }
}