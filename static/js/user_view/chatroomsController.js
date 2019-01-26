import Controller from '../interfaces/controller';
import ChatroomsView from './chatroomsView';
import ChatroomsModel from './chatroomsModel';
import { formToJSON } from '../formUtilities';
import {
    getLocalUserInformation,
    updateLocalRoomInformation,
    getLocalRoomInformation
} from "../localStorage";

export default class ChatroomsController extends Controller{
    constructor(roomSwitchCallback){
        super(new ChatroomsView(), new ChatroomsModel());

        this.onAddChatroomAttempt = this.onAddChatroomAttempt.bind(this);
        this.onChatroomOpened = this.onChatroomOpened.bind(this);
        this.getRoomInfo = this.getRoomInfo.bind(this);
        this.deleteChatroom = this.deleteChatroom.bind(this);
        this.initialiseRoom = this.initialiseRoom.bind(this);

        this.currentChatroom = {
            'roomName': ''
        };
        this.roomSwitchCallback = roomSwitchCallback;
        this.chatRooms = [];
        this.userInfo = getLocalUserInformation();

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
                    // Also clears add chatroom name form after submission
                    this.view.changeChatroom(responseMessage['room']);
                    this.chatRooms.push(responseMessage['room']);
                    this.onChatroomOpened(responseMessage['room']);
                }
                break;
            case 'getChatrooms':
                const chatrooms = responseMessage['chatrooms'];
                if(chatrooms.length > 0) {
                    this.chatRooms = chatrooms;
                    const lastChatroom = getLocalRoomInformation();
                    console.log(getLocalRoomInformation());
                    let chatroomToOpen = chatrooms[0];
                    chatrooms.forEach(chatroom => {
                        this.initialiseRoom(chatroom);
                        if(chatroom['roomId'] === lastChatroom['roomId']){
                            chatroomToOpen = chatroom;
                        }
                    });
                    this.onChatroomOpened(chatroomToOpen);
                }
                // Initialise view after chatrooms have been
                // queried from the backend
                this.view.initChatroomView();
                break;
            case 'deleteRoom':
                if(responseMessage['success']) {
                    const chatroomList = document.getElementById('chatroom-list');
                    chatroomList.removeChild(document.getElementById(`${responseMessage['roomName']}`));
                    this.chatRooms = this.chatRooms.filter(elem => elem['roomId'] !== responseMessage['roomId']);
                    if (this.chatRooms.length > 0) {
                        this.onChatroomOpened(this.chatRooms[0]);
                    } else {
                        this.currentChatroom = {
                            'roomName': '',
                            'roomId': '',
                            'inviteKey': ''
                        };
                        this.view.changeChatroom(this.currentChatroom);
                    }
                }else{
                    alert("Failed to delete chatroom");
                }
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
        updateLocalRoomInformation(chatroomInfo);
        this.view.changeChatroom(chatroomInfo);
        this.roomSwitchCallback(chatroomInfo['roomId']);
    }
    deleteChatroom(chatroomInfo){
        this.model.dispatchRoomDeletionRequest({
            ...chatroomInfo,
            'userId': this.userInfo['userId']
        });
    }
    initialiseRoom(roomInfo){
        let chatDeleteCallback = undefined;
        if(roomInfo['roomOwner'] === this.userInfo['userId']){
            chatDeleteCallback = this.deleteChatroom;
        }
        this.view.addChatroomBtn(roomInfo, this.onChatroomOpened, chatDeleteCallback);
    }
}