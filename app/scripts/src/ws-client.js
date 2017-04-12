/**
 * Created by ryanfurness on 4/5/17.
 */
let socket;
let url;

function init(initUrl){
    url = initUrl;
    socket = new WebSocket(initUrl);
}

function registerOpenHandler(handlerFunction) {
    socket.onopen = () => {
        console.log('open');
        handlerFunction();
    }
}

function registerMessageHandler(handlerFunction) {
    socket.onmessage = (e) => {
        console.log('message', e.data);
        let data = JSON.parse(e.data); //convert to javascript object instead of string
        handlerFunction(data);
    }
}

function registerCloseHandler(handlerFunction) {
    socket.onclose = () => {
        console.log('closed');
        handlerFunction();
    }
}

function sendMessage(payload){
    console.log("sending load", payload);
    socket.send(JSON.stringify(payload));//send the string through the socket
}

// Make the function wait until the connection is made...
function connectToSocket(handlerFunction){
    socket = new WebSocket(url);
    setTimeout(
        () => {
            if (socket.readyState === 1) {
                //the server connected so run the callback
                handlerFunction();
                return;
            }
            else {
                console.log("wait for connection...");
                connectToSocket(handlerFunction);
            }

        }, 5000); // wait 5ms for the connection...
}

export default {
    init,
    registerMessageHandler,
    registerOpenHandler,
    registerCloseHandler,
    sendMessage,
    connectToSocket
}