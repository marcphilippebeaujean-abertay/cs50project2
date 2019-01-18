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
        const addChatrmBtn = document.getElementsByClassName('add-chatroom-form')[0];
        if(addChatrmBtn === undefined){
            // Couldn't find add chat room button - that means this controller
            // was not meant to be used for the given view
            return;
        }
        addChatrmBtn.addEventListener(
            'submit',
            this.onAddChatroomAttempt
        );
        const toggleChatrmMenuBtns = document.getElementsByClassName('toggle-add-chatroom-window');
        Array.from(toggleChatrmMenuBtns).forEach((element) => {
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
        if(responseMessage['form'] === 'addChatRoom'){
            this.view.setMessageForAddChatroom(responseMessage);
        }
    }

}