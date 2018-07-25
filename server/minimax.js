var me;
var players = ['X', 'O'];
var empty = '';

var Minimax = {};

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

var evaluate = function (board) {
  var state = getState(board);
  if (state === players[me]) {
    return 10;
  } else if (state === players[1 - me]) {
    return -10;
  } else {
    return 0;
  }
}

var miniMax = function (board, depth, isMaximizingPlayer, turn) {

  var score = evaluate(board, turn);

  if (score !== 0) {
    return score
  }

  if (isTerminal(board)) {
    return 0;
  }

  turn = 1 - turn;

  if (isMaximizingPlayer) {
    var best = -Infinity;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] === empty) {
          board[i][j] = players[turn];
          var value = miniMax(board, depth + 1, false, turn);
          board[i][j] = empty;
          best = Math.max.apply(null, [best, value]);
        }
      }
    }
    return best;
  } else {
    var best = Infinity;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] === empty) {
        board[i][j] = players[turn];
        var value = miniMax(board, depth + 1, true, turn);
        board[i][j] = empty;
        best = Math.min.apply(null, [best, value]);
        }
      }
    }
    return best;
  }
}

Minimax.findBestMove = function (board, turn) {
  me = turn;
  var bestMove = {};
  var bestValue = -Infinity;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === empty) {
        board[i][j] = players[turn];
        var currMove = miniMax(board, 0, false, turn);
        board[i][j] = empty;
  
        if (currMove > bestValue) {
          bestMove = {
            row: i,
            col: j
          }
          bestValue = currMove;
        }
        console.log(bestValue);
  
        if (bestValue === 10) {
          return bestMove;
        }
      }
  
    }
  }
  console.log(bestMove);
  return bestMove;
}

module.exports = Minimax;