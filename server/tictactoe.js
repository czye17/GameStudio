var TicTacToe = {};

TicTacToe.isValidMove = function (game, player, row, col) {
  console.log("GAME:", game);
  console.log("PLYAER:", player);
  console.log("MOVE:", row, col);
  // check if it is player's turn
  if (game.turn % 2 === 0) {
    if (player === game.p2) {
      return false;
    }
  } else {
    if (player === game.p1) {
      return false;
    }
  }

  if (game.board[row][col] !== '') {
    return false;
  }

  return true;
}

module.exports = TicTacToe;