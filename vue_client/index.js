var socket = io();

socket.on('loginFailed', function () {
  alert("Username or Password Incorrect. Create an Account With Same Information?");
});

socket.on('loginSuccess', function () {
  enterWeb();
  alert("Login Successful!");
});

socket.on('accountCreated', function () {
  alert("Account Created! Login!");
});

socket.on('usernameTaken', function () {
  alert("Username Taken. Try Again.");
  login.username = '';
})

socket.on('newGameCreated', function (newLobby) {
  lobby.lobby = newLobby;
});

socket.on('invalidGameCreate', function () {
  alert("User cannot create/join game now.");
});

socket.on('gameStarted', function (data) {
  lobby.lobby = data.lobby;

  var type = data.game.type;
  console.log(type);
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

  if (type === 'Snake') {
    flipSnake();
  }
});

socket.on('gameEnded', function (type) {
  console.log('type:', type);
  if (type === 'TicTacToe') {
    flipTicTacToe();
  } else if (type === 'Snake') {
    flipSnake();
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

