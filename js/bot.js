// This function is used to get the next intelligent move to make for the AI.
function calculateNextMove(depth) {
    let move = new Array(2); // Size 2
  
    // Check if any available move can finish the game to make sure the AI always
    // takes the opportunity to finish the game.
    let bestMove = searchWinningMove(boardGame);
  
    if (bestMove != null) {
      // Finishing move is found.
      move[0] = parseInt(bestMove[1]);
      move[1] = parseInt(bestMove[2]);
    } else {
      // If there is no such move, search the minimax tree with specified depth.
      let dummyMatrix = cloneBoard(boardGame);
      bestMove = negamaxSearchAB(depth, dummyMatrix, false, -Infinity, Infinity);
      if (bestMove[1] === null) {
        move = null;
      } else {
        move[0] = parseInt(bestMove[1]);
        move[1] = parseInt(bestMove[2]);
      }
    }
    return move;
  }

// This function looks for a move that can instantly win the game.
function searchWinningMove(matrix) {
    let allPossibleMoves = generateMoves(matrix);
    let winningMove = new Array(3); // Size 3
  
    // Iterate for all possible moves
    for (let move of allPossibleMoves) {
      // Create a temporary board that is equivalent to the current board
      let dummyMatrix = cloneBoard(matrix);
      // Play the move on that temporary board without drawing anything
      markMove(dummyMatrix, move[1], move[0], false);
  
      // If the O player has a winning score in that temporary board, return the move.
      if (getScore(dummyMatrix, false, false) >= WIN_SCORE) {
        winningMove[1] = move[0];
        winningMove[2] = move[1];
        return winningMove;
      }
    }
    return null;
}