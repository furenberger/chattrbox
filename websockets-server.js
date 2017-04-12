const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const port = 3001;
const ws = new WebSocketServer({
    port: port
});

let messages = [];

console.log('websocket server started');

ws.on('connection', function(socket){
    console.log('client connection established');

    //show a new user all the messages
    messages.forEach(function(msg){
       socket.send(msg);
    });

    socket.on('message', function(data){
        // console.log('message received: ' , data);
        messages.push(data);

        //push the message to every connected client
        ws.clients.forEach(function(clientSocket){
           clientSocket.send(data);
        });
    })
});