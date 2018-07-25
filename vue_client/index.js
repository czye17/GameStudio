var socket = io();

var lobby = new Vue({
  el: '#lobby',
  data: {
    lobby: {},
    gameType: '',
    name: '',
    computer: ''
  },
  methods: {
    createGame: function(name, gameType, computer) {
      var validTypes = ['TicTacToe', 'Connect4', 'Snake'];
      if (!validTypes.includes(gameType) || name === '') {
        alert('Must Choose Game Type and Set Name.');
      } else {
        var single = false;
        if (computer === 'SinglePlayer') {
          single = true;
        }
        var gameData = {
          type: gameType,
          name: name,
          computer: single
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
    board: '',
    turn: '',
    gameType: 'TicTacToe'
  },
  methods: {
    makeMove: function(row, col) {
      var move = {
        row: row,
        col: col
      }
      socket.emit('ticMove', move);
    },
    gameComplete: function (gameType) {
      socket.emit('gameComplete');
      if (gameType === 'TicTacToe') {
        tictactoe.playerOne = '';
        tictactoe.playerTwo = '';
        tictactoe.board = '';
        tictactoe.turn = '';
        flipTicTacToe();
      }
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
    if (data.game.turn === 0) {
      tictactoe.turn = data.game.p1;
    } else {
      tictactoe.turn = data.game.p2;
    }
    flipTicTacToe();
  }
});

socket.on('validTicMove', function (data) {
  tictactoe.board = data.board;
  console.log(data);
  if (data.turn === 0) {
    tictactoe.turn = data.p1;
  } else {
    tictactoe.turn = data.p2;
  }
});

socket.on('invalidTicMove', function () {
  alert("Invalid Move. Try Again.");
});

socket.on('ticGameOver', function (player) {
  alert("Game Over. " + player + " wins!");
});

socket.on('ticTie', function () {
  alert("Game Over. Tie.");
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