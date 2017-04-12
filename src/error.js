var fs = require('fs');

var handleError = function(err, res){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(404);

    fs.readFile('app/404.html', function(err, data){
        res.end(data);

    });
};

module.exports = handleError;