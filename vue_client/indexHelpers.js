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

function flipSnake() {
  var game = document.getElementById("snake");
  var board = document.getElementById("lobby");
  if (game.style.display === "none") {
      game.style.display = "block";
      board.style.display = "none";
  } else {
      game.style.display = "none";
      board.style.display = "block";
  }
}

function enterWeb() {
  var login = document.getElementById("login");
  var lobby = document.getElementById("lobby");
  login.style.display = "none";
  lobby.style.display = "block";
}