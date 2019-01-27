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
        this.spinnerEnabled = false;

        this.addMessageToView = this.addMessageToView.bind(this);
        this.confirmMessage = this.confirmMessage.bind(this);
        this.toggleMessageLoadingSpinner = this.toggleMessageLoadingSpinner.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
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
        if(msgData['fromCurrentUser'] === true){
            this.scrollToBottom();
        }
    }
    confirmMessage(msgData){
        const pendingMsg = document.getElementById(msgData['pendingId']);
        if(pendingMsg === null){

        }else{
            pendingMsg.id = "";
            pendingMsg.className = 'chat-msg';
        }
    }
    toggleMessageLoadingSpinner(){
        const spinner = document.getElementById('msg-loader');
        const messagesView = document.getElementById('messages-view');
        if(spinner === undefined){
            throw 'spinner toggle called but element is undefined';
            return;
        }
        this.spinnerEnabled = !this.spinnerEnabled;
        if(this.spinnerEnabled){
            spinner.style.display = 'inherit';
            messagesView.style.display = 'none';
        }else{
            spinner.style.display = 'none';
            messagesView.style.display = 'flex';
        }
    }
    scrollToBottom(){
        const element = document.getElementById('scroll-to-bottom-elem');
        element.scrollIntoView({behavior: "smooth"});
    }
}