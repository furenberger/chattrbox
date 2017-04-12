const http = require('http');
const fs = require('fs');
const extract = require('./src/extract');
const handleError = require('./src/error');
const wss = require('./websockets-server');

const server = http.createServer(function (req, res){
    console.log('Responding to a request - createServer');

    const filePath = extract(req.url);

    fs.readFile(filePath, function(err, data){
        if(err){
            handleError(err, res);
        }else {
            if(filePath.indexOf('.css') > -1 ){
                res.setHeader('Content-Type', 'text/css');

            }else{
                res.setHeader('Content-Type', 'text/html');
            }
            res.end(data);
        }
    });
});

server.listen(3000);