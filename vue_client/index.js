var socket = io();

var lobby = new Vue({
  el: '#lobby',
  data: {
    lobby: {},
    gameType: '',
    name: ''
  },
  methods: {
    createGame: function(name, gameType) {
      var validTypes = ['TicTacToe', 'Connect4', 'Snake'];
      if (!validTypes.includes(gameType) || name === '') {
        alert('Must Choose Game Type and Set Name.');
      } else {
        var gameData = {
          type: gameType,
          name: name
        }
        socket.emit('createGame', gameData);
      }
    },
    joinGame: function(id) {
      console.log("ID:", id);
      socket.emit('joinGame', id);
    }
  }
});

var tictactoe = new Vue({
  el: '#tictactoe',
  data: {
    playerOne: '',
    playerTwo: '',
    board: ''
  },
  methods: {
    makeMove: function(row, col) {
      var move = {
        row: row,
        col: col
      }
      socket.emit('ticMove', move);
    }
  }
});

socket.on('newGameCreated', function (newLobby) {
  lobby.lobby = newLobby;
});

socket.on('invalidGameCreate', function () {
  alert("User cannot create/join game now.");
});

socket.on('gameStarted', function (data) {
  lobby.lobby = data.lobby;
  
  var type = data.game.type;
  if (type === 'TicTacToe') {
    tictactoe.playerOne = data.game.p1;
    tictactoe.playerTwo = data.game.p2;
    tictactoe.board = data.game.board;
    flipTicTacToe();
  }
});

function flipTicTacToe() {
  var game = document.getElementById("tictactoe");
  var board = document.getElementById("lobby");
  if (game.style.display === "none") {
      game.style.display = "block";
      board.style.display = "none";
  } else {
      game.style.display = "none";
      board.style.display = "block";
  }
}