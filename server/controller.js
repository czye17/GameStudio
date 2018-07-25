var tictactoe = require('./tictactoe.js');

var Controller = {};

// usually a database
var players = {};
var lobby = {};
var activeGames = {};

Controller.init = function (io) {
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
        game: null,
        address: socket
      };
    }
    
    socket.on('disconnect', function(){
      console.log('user disconnected');
      players[socket.id].connected = false;
    });

    socket.on('ticMove', function(move) {
      var player = socket.id;
      var game = activeGames[players[player].game];
      var row = move.row;
      var col = move.col;
      if (tictactoe.isValidMove(game, player, row, col)) {
        socket.emit('validTicMove', )
      } else {
        socket.emit('invalidTicMove');
      }
    });

    socket.on('createGame', function (gameData) {
      if (players[socket.id].inGame) {
        socket.emit('invalidGameCreate', socket.id);
      } else {
        players[socket.id].game = socket.id;
        players[socket.id].inGame = true;
        lobby[socket.id] = {
          id: socket.id,
          name: gameData.name,
          type: gameData.type
        }
        
        socket.emit('newGameCreated', lobby);
      }
    });

    socket.on('joinGame', function (id) {
      if (players[socket.id].inGame) {
        socket.emit('invalidGameCreate');
      } else {
        players[socket.id].game = id;
        players[socket.id].inGame = true;
        activeGames[id] = {
          p1: id,
          p2: socket.id,
          name: lobby[id].name,
          type: lobby[id].type,
          turn: 0,
          board: [['','',''],['','',''],['','','']]
        };
        lobby[id] = undefined;

        var data = {
          lobby: lobby,
          game: activeGames[id]
        };
        players[id].address.emit('gameStarted', data);
        socket.emit('gameStarted', data);
      }
    });
  });
};

module.exports = Controller;