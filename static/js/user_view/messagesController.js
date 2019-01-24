import Controller from '../interfaces/controller'
import MessagesView from './messagesView';
import MessagesModel from './messagesModel';

export default class MessagesController extends Controller{
    constructor(){
        super(new MessagesView(), new MessagesModel());
    }

}