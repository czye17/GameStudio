var minimax = require('./minimax.js');

var TicTacToe = {};
var computers = {};
var empty = '';

TicTacToe.isValidMove = function (game, player, row, col) {
  // check if it is player's turn
  if (game.turn % 2 === 0 && player === game.p2) {
    return false;
  } else if (game.turn % 2 === 1 && player === game.p1) {
    return false;
  }

  if (game.board[row][col] !== '') {
    return false;
  }

  return true;
};

TicTacToe.isOver = function (game, player) {
  var playerChar;
  if (player === game.p1) {
    playerChar = 'X';
  } else {
    playerChar = 'O';
  }
  var board = game.board;
  var score = evaluate(board, playerChar);
  if (score === 0) {
    if (isTerminal(board)) {
      return 'TIE';
    } else {
      return false;
    }
  } else {
    return 'WIN';
  }
};

TicTacToe.makeComputerMove = function (game) {
  var board = game.board;
  var turn = game.turn;
  var move = minimax.findBestMove(board, turn);
  return move;
}

var evaluate = function (game, player) {
  var state = getState(game);
  if (state === 'T') {
    return 0;
  } else if (state === player) {
    return 10;
  } else {
    return -10;
  }
};

var isTerminal = function (game) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (game[i][j] === empty) {
        return false;
      }
    }
  }
  return true;
};

var getState = function (game) {

  // check columns and rows
  for (var i = 0; i < 3; i++) {
    if (game[i][0] === game[i][1] && game[i][1] === game[i][2] && game[i][0] !== empty) {
      return game[i][0];
    }
    if (game[0][i] === game[1][i] && game[1][i] === game[2][i] && game[0][i] !== empty) {
      return game[0][i];
    }
  }

  // check diagonals
  if (game[0][0] === game[1][1] && game[1][1] === game[2][2] && game[1][1] !== empty) {
    return game[1][1];
  }
  if (game[0][2] === game[1][1] && game[1][1] === game[2][0] && game[1][1] !== empty) {
    return game[1][1];
  }

  return 'T';
};

module.exports = TicTacToe;