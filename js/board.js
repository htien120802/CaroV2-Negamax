// This function is used for mark a temporary move on the board to use for minimax
function markMove(board, x, y, isPlayer) {
  board[y][x] = isPlayer ? 1 : 2; // Human is 1, computer is 2
  // 0: Empty 1: X 2: O
}

// This function is used for rollback mark action above
function unmarkMove(board, x, y) {
  board[y][x] = 0; // Human is 1, computer is 2
  // 0: Empty 1: X 2: O
}

// This function is used for creating a copy board so as not to affect original board (boardGame)
function cloneBoard(board) {
  var boardMatrix = [];
  for (var i = 0; i < board.length; i++) {
    boardMatrix[i] = board[i].slice(); // Use slice to copy child board
  }
  return boardMatrix;
}

function generateMoves(board) {
  let moveList = [];

  // Look for cells that has at least one stone in an adjacent cell.
  for (let i = 0; i < numRow; i++) {
    for (let j = 0; j < numCol; j++) {
      if (board[i][j] > 0) continue; // Increase j --> this is marked

      if (i > 0) {
        if (j > 0) {
          if (board[i - 1][j - 1] > 0 || board[i][j - 1] > 0) {
            // Up left and top are blocked
            let move = [i, j];
            moveList.push(move);
            continue;
          }
        }
        if (j < numCol - 1) {
          if (board[i - 1][j + 1] > 0 || board[i][j + 1] > 0) {
            // Up right or right is blocked
            let move = [i, j];
            moveList.push(move);
            continue;
          }
        }
        if (board[i - 1][j] > 0) {
          // Left is blocked
          let move = [i, j];
          moveList.push(move);
          continue;
        }
      }
      if (i < numRow - 1) {
        if (j > 0) {
          if (board[i + 1][j - 1] > 0 || board[i][j - 1] > 0) {
            // Down left or left is blocked
            let move = [i, j];
            moveList.push(move);
            continue;
          }
        }
        if (j < numCol - 1) {
          if (board[i + 1][j + 1] > 0 || board[i][j + 1] > 0) {
            // Down right or right is blocked
            let move = [i, j];
            moveList.push(move);
            continue;
          }
        }
        if (board[i + 1][j] > 0) {
          // Bottom is blocked
          let move = [i, j];
          moveList.push(move);
          continue;
        }
      }
    }
  }

  return moveList;
}