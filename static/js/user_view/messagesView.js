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

export default class MessagesView{
    constructor(){
        this.lastMsgSender = '';

        this.addMessageToView = this.addMessageToView.bind(this);
        this.confirmMessage = this.confirmMessage.bind(this);
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