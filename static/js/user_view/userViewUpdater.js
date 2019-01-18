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
    setMessageForAddChatroom(msg, isSuccess){
        const errorElem = document.getElementsByClassName('adding-chat-error')[0];
        const style = isSuccess ? '"alert alert-success" role="alert"' : '"alert alert-danger" role="alert"';
        const markup = `
                <div id="adding-chat-update-msg" class=${style}>
                    ${msg}
                </div>`;
        errorElem.innerHTML = markup;
    }
}