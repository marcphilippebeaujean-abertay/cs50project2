export default class Model{
    constructor(){
        this.responseCallback = undefined;
        this.initXMLHttpReq = this.initXMLHttpReq.bind(this);
    }
    initXMLHttpReq(reqType){
        if(this.responseCallback === null){
            throw 'Response handle callback undefined!';
        }
        const request = new XMLHttpRequest();
        request.timeout = 2000;
        request.onerror = () => {
            this.responseCallback({
                'type': reqType,
                'success': false,
                'respMessage': 'Failed to dispatch request!'
            });
        };
        request.ontimeout = (e) => {
            this.responseCallback({
                'type': reqType,
                'success': false,
                'respMessage': 'Request timed out!'
            });
        };
        request.onload = () => {
            this.responseCallback({
                'type': reqType,
                ...JSON.parse(request.responseText)
            });
        };
        return request
    }
}