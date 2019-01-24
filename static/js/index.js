import "../style/style.scss";
import UserAccessController from "./user_access/userAccessController";
import ChatroomsController from "./user_view/chatroomsController";
import MessagesController from "./user_view/messagesController";
import Model from './interfaces/model';

let userAccessController = undefined;
let chatroomsController = undefined;
let messagesController = undefined;


document.addEventListener('DOMContentLoaded', () =>{
    Model.dispatchUserInfoRequest((respInfo) => {
        if(respInfo['success'] === false){
            userAccessController = new UserAccessController();
        }else{
            console.log('fetched user info');
            console.log(respInfo);
            chatroomsController = new ChatroomsController(respInfo['userInfo']);
            messagesController = new MessagesController(respInfo['userInfo']);
        }
    });
});

