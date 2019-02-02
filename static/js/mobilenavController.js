const hideElemClass = 'hide-for-phone';

export default class MobileNavController {
    constructor(){
        this.msgList = document.getElementById('chatroom-view');
        this.chatViewList = document.getElementById('user-sidebar');
        this.showingChat = true;

        this.onScreenResizedToPhoneView = this.onScreenResizedToPhoneView.bind(this);
        this.onScreenReducedToPhoneView = this.onScreenReducedToPhoneView.bind(this);

        // Setup media query for user changing view size
        const mediaQuery = window.matchMedia("(min-width: 600px)");
        mediaQuery.addListener(
            this.onScreenResizedToPhoneView
        );

        const mediaShrinkQuery = window.matchMedia("(max-width: 600px)");
        mediaQuery.addListener(
            this.onScreenReducedToPhoneView
        );

        this.phoneBarsNav = document.getElementById("hamburger-bar");
        this.arrowPhoneNav = document.getElementById("back-arrow");
        let toggleChat = () => {
            this.showingChat = !this.showingChat;
            if (this.showingChat) {
                if (!this.chatViewList.classList.contains(hideElemClass)) {
                    this.chatViewList.classList.add(hideElemClass);
                }
                this.msgList.style.display = 'inline';
                this.phoneBarsNav.style.display = 'block';
                this.arrowPhoneNav.style.display = 'none';
            } else {
                if (this.chatViewList.classList.contains(hideElemClass)) {
                    this.chatViewList.classList.remove(hideElemClass);
                }
                this.msgList.style.display = 'none';
                this.phoneBarsNav.style.display = 'none';
                this.arrowPhoneNav.style.display = 'block';
            }
        };
        this.arrowPhoneNav.addEventListener(
            'click',
            toggleChat
        );
        this.phoneBarsNav.addEventListener(
            'click',
            toggleChat
        );
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
    onScreenReducedToPhoneView(e){
        if(e.matches){
            this.phoneBarsNav.style.display = 'block';
            this.arrowPhoneNav.style.display = 'none';
        }
    }
}