var tictactoe = require('./tictactoe.js');

var Controller = {};

// usually a database
var players = {};
var lobby = {};
var activeGames = {};

Controller.init = function (io) {
  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.emit('newGameCreated', lobby);
    if (players[socket.id]) {
      players[socket.id].connected = true;
    } else {
      players[socket.id] = {
        inGame: false,
        connected: true,
        game: null,
        address: socket
      };
    }

    socket.on('disconnect', function () {
      console.log('user disconnected');
      players[socket.id].connected = false;
    });

    socket.on('ticMove', function (move) {
      var player = socket.id;
      var game = activeGames[players[player].game];
      var row = move.row, col = move.col;
      if (tictactoe.isValidMove(game, player, row, col)) {
        if (player === game.p1) {
          game.board[row][col] = 'X';
        } else {
          game.board[row][col] = 'O';
        }
        game.turn = 1 - game.turn;
        if (!game.computer) {
          players[game.p1].address.emit('validTicMove', game);
          players[game.p2].address.emit('validTicMove', game);
        }

        if (ticEnd(game, player)) { return; }

        if (game.computer) {
          var compMove = tictactoe.makeComputerMove(game);
          game.turn = 1 - game.turn;
          game.board[compMove.row][compMove.col] = 'O';
          players[game.p1].address.emit('validTicMove', game);
          ticEnd(game, 'COMPUTER');
        }
      } else {
        socket.emit('invalidTicMove');
      }
    });

    var ticEnd = function (game, player) {
      var end = tictactoe.isOver(game, player);
      if (end) {
        if (end === 'TIE') {
          players[game.p1].address.emit('ticTie');
          if (!game.computer) {
            players[game.p2].address.emit('ticTie', player);
          }
        } else {
          players[game.p1].address.emit('ticGameOver', player);
          if (!game.computer) {
            players[game.p2].address.emit('ticGameOver', player);
          }
        }
        return true;
      }
      return false;
    }

    socket.on('createGame', function (gameData) {
      if (players[socket.id].inGame) {
        socket.emit('invalidGameCreate', socket.id);
      } else if (gameData.computer) {
        players[socket.id].game = socket.id;
        players[socket.id].inGame = true;
        activeGames[socket.id] = {
          p1: socket.id,
          p2: 'COMPUTER',
          computer: true,
          name: gameData.name,
          type: gameData.type,
          turn: 0,
          board: [['', '', ''], ['', '', ''], ['', '', '']]
        };

        var data = {
          lobby: lobby,
          game: activeGames[socket.id]
        };
        socket.emit('gameStarted', data);
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
          computer: false,
          name: lobby[id].name,
          type: lobby[id].type,
          turn: 0,
          board: [['', '', ''], ['', '', ''], ['', '', '']]
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
    
    socket.on('gameComplete', function () {
      var game = activeGames[players[socket.id].game];
      var p1 = game.p1;
      var p2 = game.p2;
      if (!game.computer) {
        players[p2].game = null;
        players[p2].inGame = false;
      }
      activeGames[p1.game] = undefined;
      players[p1].inGame = false;
      players[p1].game = null;

      console.log(players[p1]);
    });
  });
};

module.exports = Controller;