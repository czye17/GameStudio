var me;

var isTerminal = function (board) {
  for (var i = 0; i < 9; i++) {
    if (board[i] === empty) {
      return false;
    }
  }
  return true;
}

var getValue = function (board, turn) {
  var state = evaluate(board);
  if (state === players[me]) {
    return 10;
  } else if (state === players[1 - me]) {
    return -10;
  } else {
    return 0;
  }
}

var evaluate = function (game) {

  // check columns and rows
  for (var i = 0; i < 3; i++) {
    if (game[i] === game[i + 3] && game[i + 3] === game[i + 6] && game[i] !== empty) {
      return game[i];
    }
    if (game[i * 3] === game[i * 3 + 1] && game[i * 3 + 1] === game[i * 3 + 2] && game[i * 3] !== empty) {
      return game[i * 3];
    }
  }

  // check diagonals
  if (game[0] === game[4] && game[4] === game[8] && game[4] !== empty) {
    return game[4];
  }
  if (game[2] === game[4] && game[4] === game[6] && game[4] !== empty) {
    return game[4];
  }

  return 'T';
}

var miniMax = function (board, depth, isMaximizingPlayer, turn) {

  var score = getValue(board, turn);

  if (score !== 0) {
    return score
  }

  if (isTerminal(board)) {
    return 0;
  }

  turn = 1 - turn;

  if (isMaximizingPlayer) {
    var best = -Infinity;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === empty) {
        board[i] = players[turn];
        var value = miniMax(board, depth + 1, false, turn);
        board[i] = empty;
        best = Math.max.apply(null, [best, value]);
      }
    }
    return best;
  } else {
    var best = Infinity;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === empty) {
        board[i] = players[turn];
        var value = miniMax(board, depth + 1, true, turn);
        board[i] = empty;
        best = Math.min.apply(null, [best, value]);
      }
    }
    return best;
  }
}

var findBestMove = function (board, turn) {
  me = turn;
  bestMove = empty;
  bestValue = -Infinity
  for (var i = 0; i < board.length; i++) {
    if (board[i] === empty) {
      board[i] = players[turn];
      var currMove = miniMax(board, 0, false, turn);
      board[i] = empty;

      if (currMove > bestValue) {
        bestMove = i;
        bestValue = currMove;
      }

      if (bestValue === 10) {
        return bestMove;
      }
    }

  }
  return bestMove;
}