import Controller from '../interfaces/controller';
import UserViewUpdater from './userViewUpdater';
import UserViewModel from './userViewModel';

export default class UserViewController extends Controller{
    constructor(){
        super(new UserViewUpdater(), new UserViewModel());
    }
    initController(){
        let toggleChatrmMenuBtns = document.getElementsByClassName('toggle-add-chatroom-window');
        Array.from(toggleChatrmMenuBtns).forEach((element) => {
            element.addEventListener(
                'click',
                this.view.toggleChatroomAddWindow);
        });
    }
}