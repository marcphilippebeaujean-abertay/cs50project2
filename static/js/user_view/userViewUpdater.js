const clearAddChatRoomWindowMsgs = () =>{
    const errorElem = document.getElementsByClassName('adding-chat-error')[0];
    errorElem.innerHTML = "";
};
export default class UserViewUpdater{
    constructor(){
        this.addChatroomWindowOpen = false;
        this.toggleChatroomAddWindow = this.toggleChatroomAddWindow.bind(this);
    }
    toggleChatroomAddWindow(){
        clearAddChatRoomWindowMsgs();
        this.addChatroomWindowOpen = !this.addChatroomWindowOpen;
        const addChatroomWindow = document.getElementById('chatroom-creation-overlay');
        if(this.addChatroomWindowOpen){
            addChatroomWindow.style.display = 'block';
        }else{
            addChatroomWindow.style.display = 'none';
        }
    }
    setMessageForAddChatroom(msgInfo){
        const errorElem = document.getElementsByClassName('adding-chat-error')[0];
        const style = msgInfo['success'] === true ? '"alert alert-success" role="alert"' : '"alert alert-danger" role="alert"';
        const markup = `
                <div id="adding-chat-update-msg" class=${style}>
                    ${msgInfo['message']}
                </div>`;
        errorElem.innerHTML = markup;
    }
}