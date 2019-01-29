import "../style/style.scss";
import UserAccessController from "./user_access/userAccessController";
import ChatroomsController from "./user_view/chatroomsController";
import MessagesController from "./user_view/messagesController";
import SocketController from "./user_view/socketManager";
import MobileNavController from "./mobilenavController";
import {getLocalUserInformation} from './localStorage';
import Model from './interfaces/model';

let userAccessController = undefined;
let chatroomsController = undefined;
let messagesController = undefined;
let socketController = undefined;


document.addEventListener('DOMContentLoaded', () =>{
    Model.dispatchUserInfoRequest((respInfo) => {
        if(respInfo['success'] === false){
            console.log('not logged in');
            window.localStorage.clear();
            userAccessController = new UserAccessController();
        }else{
            if(getLocalUserInformation().username == null ||
               getLocalUserInformation().userId == null){
                window.localStorage.setItem('username', respInfo['userInfo'].username);
                window.localStorage.setItem('userId', respInfo['userInfo'].userid);
            }else{
                // If user is still logged in locally and has
                // left the user view without logging out, redirect
                if(document.getElementsByClassName('sign-form').length > 0) {
                    window.location.href = respInfo.redirect;
                    console.log('redirecting from login/register');
                }
            }
            const usernameHeader = document.getElementById('username-header');
            usernameHeader.innerHTML = respInfo['userInfo'].username;
            messagesController = new MessagesController();
            chatroomsController = new ChatroomsController(
                messagesController.model.dispatchGetMessagesRequest
            );
            socketController = new SocketController(
                messagesController.view
            );
            const mobileNavController = new MobileNavController();
        }
    });
});

