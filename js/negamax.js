function negamaxSearchAB(depth, dummyMatrix, isPlayer, alpha, beta) {
  // Last depth (terminal node), evaluate the current board score.
  if (depth === 0) {
    let x = new Array(3);
    x[0] = evaluateMatrixForComputer(dummyMatrix, !isPlayer);
    return x;
  }

  // Generate all possible moves from this node of the Minimax Tree
  /*
   *                  (Move 1)
   *	               /
   *  (Current Node) --- (Move 2)
   *				   \   ...
   *                  (Move N)
   */
  let allPossibleMoves = generateMoves(dummyMatrix);

  // If there is no possible move left, treat this node as a terminal node and return the score.
  if (allPossibleMoves.length === 0) {
    let x = new Array(3);
    x[0] = evaluateMatrixForComputer(dummyMatrix, !isPlayer);
    return x;
  }

  let bestMove = new Array(3); // Size = 3

  bestMove[0] = -Infinity;

  for (let move of allPossibleMoves) {
    // Play the move on that temporary board without drawing anything
    markMove(dummyMatrix, move[1], move[0], isPlayer);

    // Call the minimax function for the next depth, to look for a minimum score.
    // This function recursively generates new Minimax trees branching from this node
    // (if the depth > 0) and searches for the minimum white score in each of the sub trees.
    // We will find the maximum score of this depth, among the minimum scores found in the
    // lower depth.
    let tempMove = negamaxSearchAB(
      depth - 1,
      dummyMatrix,
      !isPlayer,
      -beta,
      -alpha
    );
    tempMove[0] = -tempMove[0];

    // backtrack and remove mark
    unmarkMove(dummyMatrix, move[1], move[0]);

    // Find the move with the maximum score.
    if (Number(tempMove[0]) > Number(bestMove[0])) {
      bestMove = tempMove;
      bestMove[1] = move[0];
      bestMove[2] = move[1];
    }

    // Updating alpha (alpha value holds the maximum score)
    // When searching for the minimum, if the score of a node is lower than the alpha
    // (max score of uncle nodes from one upper level) the whole subtree originating
    // from that node will be discarded, since the maximizing player will choose the
    // alpha node over any node with a score lower than the alpha.
    if (Number(bestMove[0]) > alpha) {
      alpha = Number(bestMove[0]);
    }
    // Pruning with beta
    // Beta value holds the minimum score among the uncle nodes from one upper level.
    // We need to find a score lower than this beta score, because any score higher than
    // beta will be eliminated by the minimizing player (upper level). If the score is
    // higher than (or equal to) beta, break out of loop discarding any remaining nodes
    // and/or subtrees and return the last move.
    if (alpha >= beta) {
      return bestMove;
    }
  }

  // Return the best move found in this depth
  return bestMove;
}