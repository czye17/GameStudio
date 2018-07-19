var controller = {};

// usually a database
var players = {};
var lobby = {};
var activeGames = {};

controller.init = function (io) {
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.emit('newGameCreated', lobby);
    if (players[socket.id]) {
      players[socket.id].connected = true;
    } else {
      console.log("Created:", socket.id);
      players[socket.id] = {
        inGame: false,
        connected:true,
        game: null
      };
    }
    socket.on('disconnect', function(){
      console.log('user disconnected');
      players[socket.id].connected = false;
    });
    socket.on('click', function(id) {
      console.log("square:", id);
    });
    socket.on('createGame', function () {
      if (players[socket.id].inGame) {
        socket.emit('invalidGameCreate', socket.id);
      } else {
        players[socket.id].game = socket.id;
        players[socket.id].inGame = true;
        var gameName = 'Game ' + socket.id
        lobby[socket.id] = {
          id: socket.id,
          name: gameName
        }
        
        socket.emit('newGameCreated', lobby);
      }
    });
    socket.on('joinGame', function (id) {
      console.log("lobby:", lobby);
      console.log(id);
      if (players[socket.id].inGame) {
        socket.emit('invalidGameCreate', socket.id);
      } else {
        players[socket.id].inGame = true;
        players[socket.id].game = socket.id;
        var playerOne = lobby[id].id;
        var gameName = lobby[id].name;
        lobby[id] = undefined;
        activeGames[id] = {
          id: playerOne,
          p1: playerOne,
          p2: socket.id,
          name: gameName
        }

        console.log(activeGames);
        socket.emit('gameStarted', lobby);
      }
    });
  });
};

module.exports = controller;