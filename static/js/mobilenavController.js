export default class MobileNavController {
    constructor(){
        this.msgList = document.getElementById('user-sidebar');
        this.chatroomViewElements = document.getElementById('chatroom-view');
        this.showingChat = true;

        document.getElementById('bars-nav').addEventListener(
            'click',
            () => {
            console.log('nav bar toggle');
            this.showingChat = !this.showingChat;
            if(this.showingChat){
                this.chatroomViewElements.style.display = 'none';
                this.msgList.style.display = 'inline';
            }else{
                this.chatroomViewElements.style.display = 'inline';
                this.msgList.style.display = 'none';
            }
        });
    }
}