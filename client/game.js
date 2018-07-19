var board = [];
var socket = io();

for (var i = 0; i < 9; i++) {
  board.push(document.getElementById(String(i)));
  board[i].onclick = function (e) {
    var square = e.path[0];
    socket.emit('click', square.id);
  }
}

var lobby = new Vue({
  el: '#lobby',
  data: {
    lobby: {}
  }
})

socket.on('newGameCreated', function (newLobby) {
  console.log(newLobby);
  lobby.lobby = newLobby;
});

socket.on('invalidGameCreate', function (user) {
  alert("User cannot create/join game now.");
});

socket.on('gameStarted', function (newLobby) {
  lobby.lobby = lobby;
});

function createGame() {
  socket.emit('createGame');
}

function joinGame(gameID) {
  console.log(gameID);
  socket.emit('joinGame', gameID);
}

function flipViews() {
  var x = document.getElementById("game");
  var y = document.getElementById("lobby");
  if (x.style.display === "none") {
      x.style.display = "block";
      y.style.display = "none";
  } else {
      x.style.display = "none";
      y.style.display = "block";
  }
}

console.log(board);