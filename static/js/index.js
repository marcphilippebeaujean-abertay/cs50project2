import "../style/style.scss";
import UserAccessController from "./user_access/userAccessController";
import ChatroomsController from "./user_view/chatroomsController";
import MessagesController from "./user_view/messagesController";
import SocketController from "./user_view/socketManager";
import {getLocalUserInformation} from './localStorage';
import Model from './interfaces/model';

let userAccessController = undefined;
let chatroomsController = undefined;
let messagesController = undefined;
let socketController = undefined;

window.addEventListener("popstate", function(e) {
    window.location.reload();
});

document.addEventListener('DOMContentLoaded', () =>{
    Model.dispatchUserInfoRequest((respInfo) => {
        if(respInfo['success'] === false){
            userAccessController = new UserAccessController();
        }else{
            console.log(respInfo);
            if(getLocalUserInformation().username == null ||
               getLocalUserInformation().userId == null){
                window.localStorage.setItem('username', respInfo['userInfo'].username);
                window.localStorage.setItem('userId', respInfo['userInfo'].userid);
            }else{
                // If user is still logged in locally and has
                // left the user view without logging out, redirect
                window.location.href = respInfo.redirect;
            }
            messagesController = new MessagesController();
            chatroomsController = new ChatroomsController(
                messagesController.model.dispatchGetMessagesRequest
            );
            socketController = new SocketController(
                messagesController.view
            );
        }
    });
});

