export default class UserViewUpdater{
    constructor(){
        this.addChatroomWindowOpen = false;
        this.toggleChatroomAddWindow = this.toggleChatroomAddWindow.bind(this);
    }
    toggleChatroomAddWindow(){
        console.log('toggling the add chatroom window');
        this.addChatroomWindowOpen = !this.addChatroomWindowOpen;
        const addChatroomWindow = document.getElementById('chatroom-creation-overlay');
        if(this.addChatroomWindowOpen){
            addChatroomWindow.style.display = 'block';
        }else{
            addChatroomWindow.style.display = 'none';
        }
    }
}