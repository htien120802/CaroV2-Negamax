const WIN_SCORE = 100000000;

// This function calculates the relative score of the O player against the X.
// (i.e. how likely is O player to win the game before the X player)
// This value will be used as the score in the Minimax algorithm.
function evaluateMatrixForComputer(board, isPlayerTurn) {
  // Get board score of both players.
  let humanScore = getScore(board, true, isPlayerTurn);
  let computerScore = getScore(board, false, isPlayerTurn);

  if (humanScore === 0) humanScore = 1.0;

  // Calculate relative score of computer against human
  return computerScore / humanScore;
}

// This function calculates the board score of the specified player.
// (i.e. How good a player's general standing on the board by considering how many
//  consecutive 2's, 3's, 4's it has, how many of them are blocked etc...)
function getScore(board, isForPlayer, isPlayerTurn) {
  // Read the board
  let boardMatrix = cloneBoard(board);

  // Calculate score for each of the 3 directions
  return (
    evaluateHorizontal(boardMatrix, isForPlayer, isPlayerTurn) +
    evaluateVertical(boardMatrix, isForPlayer, isPlayerTurn) +
    evaluateDiagonal(boardMatrix, isForPlayer, isPlayerTurn)
  );
}

// This function calculates the score by evaluating the stone positions in horizontal direction
function evaluateHorizontal(board, isForPlayer, isPlayersTurn) {
  let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score
  // blocks variable is used to check if a consecutive stone set is blocked by the opponent or
  // the board border. If the both sides of a consecutive set is blocked, blocks variable will be 2
  // If only a single side is blocked, blocks variable will be 1, and if both sides of the consecutive
  // set is free, blocks count will be 0.
  // By default, first cell in a row is blocked by the left border of the board.
  // If the first cell is empty, block count will be decremented by 1.
  // If there is another empty cell after a consecutive stones set, block count will again be
  // decremented by 1.
  // Iterate over all numRow
  for (let i = 0; i < numRow; i++) {
    // Iterate over all cells in a row
    for (let j = 0; j < numCol; j++) {
      // Check if the selected player has a stone in the current cell
      evaluateDirections(board, i, j, isForPlayer, isPlayersTurn, evaluations);
    }
    evaluateDirectionsAfterOnePass(evaluations, isForPlayer, isPlayersTurn);
  }

  return evaluations[2];
}

// This function calculates the score by evaluating the stone positions in vertical direction
// The procedure is the exact same of the horizontal one.
function evaluateVertical(board, isForPlayer, isPlayersTurn) {
  let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

  for (let j = 0; j < numCol; j++) {
    for (let i = 0; i < numRow; i++) {
      evaluateDirections(board, i, j, isForPlayer, isPlayersTurn, evaluations);
    }
    evaluateDirectionsAfterOnePass(evaluations, isForPlayer, isPlayersTurn);
  }
  return evaluations[2];
}

// This function calculates the score by evaluating the stone positions in diagonal directions
// The procedure is the exact same of the horizontal calculation.
function evaluateDiagonal(board, isForPlayer, isPlayersTurn) {
  let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score
  // From bottom-left to top-right diagonally
  for (let k = 0; k <= 2 * (numRow - 1); k++) {
    let iStart = Math.max(0, k - numRow + 1);
    let iEnd = Math.min(numRow - 1, k);
    for (let i = iStart; i <= iEnd; ++i) {
      evaluateDirections(
        board,
        i,
        k - i,
        isForPlayer,
        isPlayersTurn,
        evaluations
      );
    }
    evaluateDirectionsAfterOnePass(evaluations, isForPlayer, isPlayersTurn);
  }
  // From top-left to bottom-right diagonally
  for (let k = 1 - numRow; k < numRow; k++) {
    let iStart = Math.max(0, k);
    let iEnd = Math.min(numRow + k - 1, numRow - 1);
    for (let i = iStart; i <= iEnd; ++i) {
      evaluateDirections(
        board,
        i,
        i - k,
        isForPlayer,
        isPlayersTurn,
        evaluations
      );
    }
    evaluateDirectionsAfterOnePass(evaluations, isForPlayer, isPlayersTurn);
  }
  return evaluations[2];
}

function evaluateDirections(board, i, j, isBot, isBotTurn, eval) {
  // Check if the selected player has a stone in the current cell
  if (board[i][j] === (isBot ? 1 : 2)) {
    // Increment consecutive stones count
    eval[0]++;
  }
  // Check if cell is empty
  else if (board[i][j] === 0) {
    // Check if there were any consecutive stones before this empty cell
    if (eval[0] > 0) {
      // Consecutive set is not blocked by opponent, decrement block count
      eval[1]--;
      // Get consecutive set score
      eval[2] += getConsecutiveSetScore(
        eval[0],
        eval[1],
        isBot === isBotTurn
      );
      // Reset consecutive stone count
      eval[0] = 0;
      // Current cell is empty, next consecutive set will have at most 1 blocked side.
    }
    // No consecutive stones.
    // Current cell is empty, next consecutive set will have at most 1 blocked side.
    eval[1] = 1;
  }
  // Cell is occupied by opponent
  // Check if there were any consecutive stones before this empty cell
  else if (eval[0] > 0) {
    // Get consecutive set score
    eval[2] += getConsecutiveSetScore(
      eval[0],
      eval[1],
      isBot === isBotTurn
    );
    // Reset consecutive stone count
    eval[0] = 0;
    // Current cell is occupied by opponent, next consecutive set may have 2 blocked sides
    eval[1] = 2;
  } else {
    // Current cell is occupied by opponent, next consecutive set may have 2 blocked sides
    eval[1] = 2;
  }
}

function evaluateDirectionsAfterOnePass(eval, isBot, isPlayersTurn) {
  // End of row, check if there were any consecutive stones before we reached right border
  if (eval[0] > 0) {
    eval[2] += getConsecutiveSetScore(
      eval[0],
      eval[1],
      isBot === isPlayersTurn
    );
  }
  // Reset consecutive stone and blocks count
  eval[0] = 0;
  eval[1] = 2;
}

// This function returns the score of a given consecutive stone set.
// count: Number of consecutive stones in the set
// blocks: Number of blocked sides of the set (2: both sides blocked, 1: single side blocked, 0: both sides free)
function getConsecutiveSetScore(count, blocks, isCurrentTurn) {
  const winGuarantee = 1000000;
  // If both sides of a set is blocked, this set is worthless return 0 points.
  if (blocks === 2 && count < 5) return 0;

  switch (count) {
    case 5: {
      // 5 consecutive wins the game
      return WIN_SCORE;
    }
    case 4: {
      // 4 consecutive stones in the user's turn guarantees a win.
      // (User can win the game by placing the 5th stone after the set)
      if (isCurrentTurn) return winGuarantee;
      else {
        // Opponent's turn
        // If neither side is blocked, 4 consecutive stones guarantees a win in the next turn.
        if (blocks === 0) return winGuarantee / 4;
        // If only a single side is blocked, 4 consecutive stones limits the opponents move
        // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
        // in the next turn). So a relatively high score is given for this set.
        else return 200;
      }
    }
    case 3: {
      // 3 consecutive stones
      if (blocks === 0) {
        // Neither side is blocked.
        // If it's the current player's turn, a win is guaranteed in the next 2 turns.
        // (User places another stone to make the set 4 consecutive, opponent can only block one side)
        // However the opponent may win the game in the next turn therefore this score is lower than win
        // guaranteed scores but still a very high score.
        if (isCurrentTurn) return 50000;
        // If it's the opponent's turn, this set forces opponent to block one of the sides of the set.
        // So a relatively high score is given for this set.
        else return 200;
      } else {
        // One of the sides is blocked.
        // Playmaker scores
        if (isCurrentTurn) return 10;
        else return 5;
      }
    }
    case 2: {
      // 2 consecutive stones
      // Playmaker scores
      if (blocks === 0) {
        if (isCurrentTurn) return 7;
        else return 5;
      } else {
        return 3;
      }
    }
    case 1: {
      return 1;
    }
  }

  // More than 5 consecutive stones?
  return WIN_SCORE * 2;
}
