var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var controller = require('./server/controller');

var port = 4040;

app.use('/vue_client', express.static(__dirname + '/vue_client'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/vue_client/index.html');
});

controller.init(io);

http.listen(port, function(){
  console.log('listening on *:4040');
});