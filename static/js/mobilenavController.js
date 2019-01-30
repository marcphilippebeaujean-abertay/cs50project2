const hideElemClass = 'hide-for-phone';

export default class MobileNavController {
    constructor(){
        this.msgList = document.getElementById('chatroom-view');
        this.chatViewList = document.getElementById('user-sidebar');
        this.showingChat = true;

        this.onScreenResizedToPhoneView = this.onScreenResizedToPhoneView.bind(this);

        // Setup media query for user changing view size
        const mediaQuery = window.matchMedia("(min-width: 600px)");
        mediaQuery.addListener(
            this.onScreenResizedToPhoneView
        );

        document.getElementById('bars-nav').addEventListener(
            'click',
            () => {
            this.showingChat = !this.showingChat;
            if(this.showingChat){
                if(!this.chatViewList.classList.contains(hideElemClass)) {
                    this.chatViewList.classList.add(hideElemClass);
                }
                this.msgList.style.display = 'inline';
            }else{
                if(this.chatViewList.classList.contains(hideElemClass)) {
                    this.chatViewList.classList.remove(hideElemClass);
                }
                this.msgList.style.display = 'none';
            }
        });
    }
    onScreenResizedToPhoneView(e){
        if(e.matches){
            if(!this.chatViewList.classList.contains(hideElemClass)) {
                this.chatViewList.classList.add(hideElemClass);
            }
            this.msgList.style.display = 'inline';
            this.showingChat = true;
        }
    }
}