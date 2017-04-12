/**
 * Created by ryanfurness on 4/5/17.
 */


import socket from './ws-client';
import { UserStore } from './storage';
import { ChatForm, ChatList, promptForUsername } from './dom';

const FORM_SELECTOR  = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR  = '[data-chat="message-list"]';
const STATUS_SELECTOR  = '#status-message';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if(!username) {
    username = promptForUsername();
    userStore.set(username);
}

const SOCKET_URL = 'ws://localhost:3001';

class ChatApp {
    constructor(){
        this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR, STATUS_SELECTOR);
        this.chatList = new ChatList(LIST_SELECTOR, username);

        this.init();
    }

    init(){
        socket.init(SOCKET_URL);

        socket.registerOpenHandler(() => {
            console.log("registerOpenHandler");

            this.chatForm.setConnectionMessage('');
            this.chatForm.init((data) => {
                let message = new ChatMessage({message: data});
                socket.sendMessage(message.serialize());
            });
            this.chatList.init();
        });

        socket.registerCloseHandler(() => {
            this.chatForm.setConnectionMessage('Lost connection to server');
            this.init();
        });

        socket.registerMessageHandler((data) => {
            console.log('registerMessageHandler ', data);
            let message = new ChatMessage(data);
            this.chatList.drawMessage(message.serialize());
        });
    }
}

class ChatMessage {
    constructor({
                    message: m,
                    user: u = username,
                    timestamp: t = (new Date().getTime())
                }){
        // console.log(`m ${m} u ${u} t ${t}`);
        this.message = m;
        this.user = u;
        this.timestamp = t;
    }
    serialize(){
        return {
            message: this.message,
            user: this.user,
            timestamp: this.timestamp
        }
    }
}

export default ChatApp;