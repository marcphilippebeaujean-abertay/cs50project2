import Controller from '../interfaces/controller';
import UserViewUpdater from './userViewUpdater';
import UserViewModel from './userViewModel';
import { formToJSON } from '../formUtilities';

export default class UserViewController extends Controller{
    constructor(){
        super(new UserViewUpdater(), new UserViewModel());

        this.onAddChatroomAttempt = this.onAddChatroomAttempt.bind(this);
        this.responseCallback = this.responseCallback.bind(this);

        this.model.responseCallback = this.responseCallback;

    }
    initController(){
        const addChatroomForm = document.getElementsByClassName('add-chatroom-form')[0];
        if(addChatroomForm === undefined){
            // Couldn't find add chat room button - that means this controller
            // was not meant to be used for the given view
            return;
        }
        addChatroomForm.addEventListener(
            'submit',
            this.onAddChatroomAttempt
        );
        const toggleChatroomMenuBtns = document.getElementsByClassName('toggle-add-chatroom-window');
        Array.from(toggleChatroomMenuBtns).forEach((element) => {
            element.addEventListener(
                'click',
                this.view.toggleChatroomAddWindow);
        });
    }
    onAddChatroomAttempt(e){
        event.preventDefault();
        this.model.dispatchAddChatroomRequest(formToJSON('add-chatroom-form'));

    }
    responseCallback(responseMessage){
        switch(responseMessage['form']){
            case 'addChatRoom':
                this.view.setMessageForAddChatroom(responseMessage['respMessage'], responseMessage['success']);
                if (responseMessage['success']) {
                    // Add new chatroom to list
                }
                break;
            case 'getChatrooms':
                console.log(responseMessage['chatrooms']);
                break;
            default:
                console.log('weird response form');
        }
    }
    onChatroomOpened(chatroomName){
        console.log(`opening ${chatroomName}`);
    }
}