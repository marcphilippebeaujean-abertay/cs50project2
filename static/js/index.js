import "../style/style.scss";
import UserAccessController from "./user_access/userAccessController";
import ChatroomsController from "./user_view/chatroomsController";
import MessagesController from "./user_view/messagesController";

const userAccessController = new UserAccessController();
const userViewController = new ChatroomsController();
const messagesController = new MessagesController();