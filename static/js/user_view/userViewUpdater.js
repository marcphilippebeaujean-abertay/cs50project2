const clearAddChatRoomWindowMsgs = () =>{
    const errorElem = document.getElementsByClassName('adding-chat-error')[0];
    errorElem.innerHTML = "";
};
const convertTimeStamp = (timestamp) => {
    let pad = function(input) {return input < 10 ? "0" + input : input;};
    let date = new Date(timestamp);
    return [[
            pad(date.getFullYear()),
            pad((date.getMonth()+1)),
            pad(date.getDate()),
        ].join('/'), [
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds())
        ].join(':')
    ].join(' - ');
};

export default class UserViewUpdater{
    constructor(){
        this.overlayOpen = false;
        this.lastMsgSender = '';

        this.toggleChatroomAddWindow = this.toggleChatroomAddWindow.bind(this);
        this.addChatroomBtn = this.addChatroomBtn.bind(this);
        this.changeChatroom = this.changeChatroom.bind(this);
        this.initChatroomView = this.initChatroomView.bind(this);
        this.toggleDeletionConfirmation = this.toggleDeletionConfirmation.bind(this);
    }
    toggleChatroomAddWindow(){
        clearAddChatRoomWindowMsgs();
        this.overlayOpen = !this.overlayOpen;
        const addChatroomWindow = document.getElementById('chatroom-creation-overlay');
        if(this.overlayOpen){
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
    addChatroomBtn(chatroomInfo, chatroomButtonCallback, deleteChatroomCallback){
        const chatroomList = document.getElementById('chatroom-list');
        let deleteBtnMarkup = `<i class="fas fa-trash delete-room-btn" id="delete-${chatroomInfo['roomName']}"></i>`;
        if(deleteChatroomCallback === undefined){
            deleteBtnMarkup = '';
        };
        const markup = `
            <li class="chatroom-btn" id="${chatroomInfo['roomName']}">
                ${chatroomInfo['roomName']} ${deleteBtnMarkup}
            </li>
        `;
        chatroomList.insertAdjacentHTML('beforeend', markup);
        const chatroomButton = document.getElementById(`${chatroomInfo['roomName']}`);
        chatroomButton.addEventListener(
            'click',
            () => {
                chatroomButtonCallback(chatroomInfo);
            }
        );
        let deleteBtn = document.getElementById(`delete-${chatroomInfo['roomName']}`);
        if(deleteBtn !== null){
            deleteBtn.addEventListener(
                'click',
                () => {
                    this.toggleDeletionConfirmation(deleteChatroomCallback, chatroomInfo);
                    //deleteChatroomCallback(chatroomInfo);
                    chatroomList.removeChild(document.getElementById(`${chatroomInfo['roomName']}`));
                }
            );
        }
    }
    toggleDeletionConfirmation(deletionCallback, chatroomInfo){
        const removeChat = document.getElementById('delete-chatroom-overlay');
        this.overlayOpen = !this.overlayOpen;
        if(this.overlayOpen){
            removeChat.style.display = 'block';
        }else{
            removeChat.style.display = 'none';
        }
    }
    changeChatroom(chatroomInfo){
        this.lastMsgSender = '';
        const prevChat = document.getElementsByClassName('chatroom-current')[0];
        if(prevChat){
            prevChat.classList.remove('chatroom-current');
        }
        const newChatroom = document.getElementById(`${chatroomInfo['roomName']}`);
        newChatroom.classList.add('chatroom-current');
        const chatView = document.getElementById('messages-view');
        chatView.innerHTML = '';
        const inviteKey = document.getElementById(`invite-key`);
        inviteKey.innerHTML = chatroomInfo['inviteKey'];
    }
    initChatroomView(){
        document.getElementById('user-view-grid').style.display = 'grid';
    }
    addMessageToView(msgData){
        const msgList = document.getElementById('messages-view');
        const pendingClass = msgData['isPending'] ? 'chat-msg-pending' : '';
        const curUserClass = msgData['fromCurrentUser'] ? '' : 'other-user-msg';
        const markup = `
            <div class="chat-msg ${curUserClass} ${pendingClass}" id="${msgData['pendingId']}">
                <span class="msg-content">${msgData['message']}</span>
            </div>
            <small class="msg-timestamp">${convertTimeStamp(msgData['timestamp'])}</small>
        `;
        if(this.lastMsgSender !== msgData['username']){
            const curUsername = msgData['fromCurrentUser'] ? 'You' : msgData['username'];
            const userStyleMsg = msgData['fromCurrentUser'] ? '' : 'other-user-name-display';
            msgList.insertAdjacentHTML('beforeend', `<p class='user-indicator ${userStyleMsg}'>${curUsername}</p>`);
            this.lastMsgSender = msgData['username'];
        }
        msgList.insertAdjacentHTML('beforeend', markup);
    }
    confirmMessage(msgData){
        const pendingMsg = document.getElementById(msgData['pendingId']);
        if(pendingMsg === null){

        }else{
            pendingMsg.id = "";
            pendingMsg.className = 'chat-msg';
        }
    }
}