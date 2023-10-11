let currentPlayer = "X"; // Người chơi hiện tại, bắt đầu là X
let isGameOver = false;
let board;
let currentDisplay;
let numRow;
let numCol;
let selectedMode = "2Players";
let selectedLevel = "Easy";
let boardGame = [];
let DEPTH;

document.addEventListener("DOMContentLoaded", function () {
  board = document.getElementById("caro-board");

  currentDisplay = document.getElementById("current-player");

  document.getElementById("playerMode").addEventListener("change", function () {
    selectedMode = document.getElementById("playerMode").value;

    if (selectedMode === "2Players") {
      document.getElementsByClassName("level-container")[0].style.visibility =
        "hidden";
    } else {
      document.getElementsByClassName("level-container")[0].style.visibility =
        "visible";
      document.getElementById("level").selectedIndex = 0;
      selectedLevel = "Easy";
    }

    resetBoard();
  });

  document.getElementById("level").addEventListener("change", function () {
    selectedLevel = document.getElementById("level").value;
    resetBoard();
  });
});

function generateBoard(rows, cols) {
  board.innerHTML = "";
  board.style.setProperty(
    "grid-template-columns",
    "repeat(" + cols + ", 40px)"
  );
  isGameOver = false;
  currentPlayer = "X";

  currentDisplay.textContent = "Người chơi: X";
  for (let i = 0; i < rows; i++) {
    boardGame[i] = [];
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.classList.add("cell");
      cell.addEventListener("click", handleCellClick);
      board.appendChild(cell);
      boardGame[i][j] = 0;
    }
  }
  board.style.visibility = "visible";
  currentDisplay.style.visibility = "visible";
}
function handleCellClick(event) {
  if (isGameOver) {
    return; // Không cho phép đánh khi trò chơi kết thúc
  }

  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (boardGame[row][col] === 0) {
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === "X" ? "red" : "blue";
    boardGame[row][col] = currentPlayer === "X" ? 1 : 2;
    checkResult(row, col);

    if (!isGameOver && selectedMode === "vsComputer" && currentPlayer === "X") {
      currentPlayer = "O";
      let point = getPointsComputer();
      let c = getCellByRowCol(point[0], point[1]);
      c.textContent = "O";
      c.style.color = "blue";

      boardGame[point[0]][point[1]] = 2;

      checkResult(point[0], point[1]);
      currentPlayer = "X";
    } else {
      togglePlayer();
    }
  }
}

function togglePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById(
    "current-player"
  ).textContent = `Người chơi: ${currentPlayer}`;
}

function clickCreate() {
  numRow = parseInt(document.getElementById("rows").value);
  numCol = parseInt(document.getElementById("cols").value);

  if (isNaN(numRow) || isNaN(numCol) || numRow < 1 || numCol < 1) {
    alert("Vui lòng nhập kích thước hợp lệ.");
    return;
  }

  generateBoard(numRow, numCol);
}

function resetBoard() {
  // Clear all moves on the board
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.textContent = "";
  });

  // Reset game variables
  currentPlayer = "X";
  currentDisplay.textContent = "Người chơi: X";
  isGameOver = false;
  document.getElementById("log").innerHTML = "";

  for (let i = 0; i < numRow; i++)
    for (let j = 0; j < numCol; j++) {
      if (boardGame[i][j] > 0) boardGame[i][j] = 0;
    }
}

function getHorizontal(x, y, player) {
  let mark = player === "X" ? 1 : 2;
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (y + i < numCol && boardGame[x][y + i] === mark) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (y - i >= 0 && y - i < numCol && boardGame[x][y - i] === mark) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function getVertical(x, y, player) {
  let mark = player === "X" ? 1 : 2;
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (x + i < numRow && boardGame[x + i][y] === mark) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (x - i >= 0 && x - i < numRow && boardGame[x - i][y] === mark) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function getRightDiagonal(x, y, player) {
  let count = 1;
  let mark = player === "X" ? 1 : 2;
  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < numRow &&
      y + i < numCol &&
      boardGame[x - i][y + i] === mark
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      x + i < numRow &&
      y - i >= 0 &&
      y - i < numCol &&
      boardGame[x + i][y - i] === mark
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function getLeftDiagonal(x, y, player) {
  let mark = player == "X" ? 1 : 2;
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < numRow &&
      y - i >= 0 &&
      y - i < numCol &&
      boardGame[x - i][y - i] === mark
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (x + i < numRow && y + i < numCol && boardGame[x + i][y + i] == mark) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function checkWin(x, y, player) {
  return (
    getHorizontal(x, y, player) >= 5 ||
    getVertical(x, y, player) >= 5 ||
    getRightDiagonal(x, y, player) >= 5 ||
    getLeftDiagonal(x, y, player) >= 5
  );
}

function checkDraw() {
  for (let i = 0; i < numRow; i++)
    for (let j = 0; j < numCol; j++) if (boardGame[i][j] == 0) return false;
  return true;
}

function checkResult(row, col) {
  if (checkWin(row, col, currentPlayer)) {
    if (selectedMode === "vsComputer" && currentPlayer === "O") {
      alert ("Bạn thua rồi");
    } else {
    alert(`Người chơi ${currentPlayer} chiến thắng!`);
    }
    isGameOver = true;
  }

  if (checkDraw()) {
    alert("Ván này hòa!");
    isGameOver = true;
  }
}

function getCellByRowCol(row, col) {
  return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function assignDepth(){
  if (selectedLevel === "Easy"){
    DEPTH = 2;
  } else if (selectedLevel === "Medium"){
    DEPTH = 4;
  } else {
    DEPTH = 6;
  }
}

function getPointsComputer() {
  assignDepth();
  let point = calculateNextMove(DEPTH);
  return point;
}
