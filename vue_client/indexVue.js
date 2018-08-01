var login = new Vue({
  el: '#login',
  data: {
    name: '',
    username: '',
    password: ''
  },
  methods: {
    login: function(username, password) {
      var login = {
        username: username,
        password: password
      };
      socket.emit('loginRequest', login);
    },
    createUser: function(username, password, name) {
      if (!username || !password || !name) {
        return alert("Invalid value in one field.");
      }
      var newUser = {
        username: username,
        password: password,
        name: name
      };
      socket.emit('newAccount', newUser);
    }
  }
});

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
        if (computer === 'SinglePlayer' || gameType === 'Snake') {
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
    },
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
    gameComplete: function () {
      socket.emit('gameComplete');
    }
  }
});

var snake = new Vue({
  el: '#snake',
  data: {
    snake: [],
    player: '',
    board: '',
    gameType: 'Snake'
  }
});