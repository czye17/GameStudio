var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var controller = require('./server/controller');
var MongoClient = require('mongodb').MongoClient;

var port = 4040;

app.use('/vue_client', express.static(__dirname + '/vue_client'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/vue_client/index.html');
});

app.get('/snake', function (req, res) {
  res.sendFile(__dirname + '/vue_client/snake.html');
});

controller.init(io);

http.listen(port, function () {
  console.log('listening on *:4040');
});

// MONGODB
var url = 'mongodb+srv://czye:Houston4607!@yetactoe-ty9uv.mongodb.net/test?retryWrites=true';
var dbName = 'gamestudio';
controller.dataInit(url, dbName);

MongoClient.connect(url, function (err, client) {
  var users = client.db(dbName).collection("users");

  // perform actions on the collection object
  users.findOne({ username: 'ADMIN' }, function (err, admin) {
    if (err) { console.log(err); }
    if (admin === null) {
      users.insert({ name: 'ADMIN', username: 'ADMIN', password: '123456', role: 'ADMIN' }, function (err, admin) {
        if (err) { console.log(err); }
        client.close();
      });
    }
  });
});