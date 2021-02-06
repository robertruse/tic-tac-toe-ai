const boardElement = document.querySelector("#board");
const cellElements = document.querySelectorAll(".cell");
const gameOverElement = document.querySelector("#game-over");
const gameOverTextElements = document.querySelectorAll(".game-over-text");
const navBarElement = document.querySelector("#nav-bar");
const toggleButton = document.querySelector("#toggle-button");
const menuElement = document.querySelector("#nav-menu");
const restartButton = document.querySelector("#restart-button");
const playerCountButtons = document.querySelectorAll(".nav-menu .btn");

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let circleTurn;
let originalBoard;
let playerCount;

toggleButton.addEventListener("click", openMenu);

function openMenu(e) {
  navBarElement.classList.toggle("show");
}

function closeMenu(e) {
  navBarElement.classList.remove("show");
}

playerCountButtons.forEach((button) => {
  button.addEventListener("click", setPlayerCount);
});

function setPlayerCount(e) {
  let buttonId = e.currentTarget.id;
  playerCount = buttonId.slice(buttonId.length - 1);
  startGame();
}

restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  originalBoard = Array.from(Array(9).keys());
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", turnClick);
    cell.addEventListener("click", turnClick);
  });
  setBoardHoverClass();
  gameOverElement.classList.remove("show");
  removeShowClass(gameOverTextElements);
  closeMenu();
  if (playerCount) {
    toggleButton.classList.add("show");
  } else {
    toggleButton.classList.remove("show");
  }
}

function turnClick(e) {
  if (typeof originalBoard[e.target.id] !== "number") return;
  const cell = e.target;
  playerTurn(cell);
  if (playerCount > 1) return;
  if (checkWin(originalBoard, X_CLASS) || checkDraw(originalBoard)) return;
  setTimeout(() => {
    playerTurn(bestSpot());
  }, 100);
}

function playerTurn(cell) {
  if (checkWin(originalBoard, CIRCLE_CLASS)) return;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  endTurn(originalBoard, currentClass);
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  originalBoard[cell.id] = currentClass;
}

function endTurn(board, currentClass) {
  if (checkWin(board, currentClass)) {
    setTimeout(() => {
      declareWinner(currentClass);
    }, 200);
  } else if (checkDraw(board)) {
    setTimeout(() => {
      declareWinner(false);
    }, 200);
  }
  swapTurns();
  setBoardHoverClass();
}

function checkWin(board, currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return board[index] === currentClass;
    });
  });
}

function checkDraw(board) {
  return board.every((currentValue) => {
    return currentValue === X_CLASS || currentValue === CIRCLE_CLASS;
  });
}

function declareWinner(currentClass) {
  switch (currentClass) {
    case X_CLASS:
      gameOverTextElements[0].classList.add("show");
      break;
    case CIRCLE_CLASS:
      gameOverTextElements[1].classList.add("show");
      break;
    default:
      gameOverTextElements[2].classList.add("show");
  }
  gameOverElement.classList.add("show");
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  boardElement.classList.remove(X_CLASS);
  boardElement.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    boardElement.classList.add(CIRCLE_CLASS);
  } else {
    boardElement.classList.add(X_CLASS);
  }
}

function removeShowClass(nodeList) {
  nodeList.forEach((item) => {
    item.classList.remove("show");
  });
}

/* Minimax algorithm AI */
function bestSpot() {
  let cellIndex = minimax(originalBoard, CIRCLE_CLASS).index;
  return cellElements[cellIndex];
}

function emptySquares(board) {
  return board.filter((currentValue) => {
    return typeof currentValue == "number";
  });
}

function minimax(newBoard, player) {
  let availableSpots = emptySquares(newBoard);

  if (checkWin(newBoard, X_CLASS)) {
    return { score: -10 };
  } else if (checkWin(newBoard, CIRCLE_CLASS)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;
    if (player == CIRCLE_CLASS) {
      move.score = minimax(newBoard, X_CLASS).score;
    } else if (player == X_CLASS) {
      move.score = minimax(newBoard, CIRCLE_CLASS).score;
    }
    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove, bestScore;

  if (player === CIRCLE_CLASS) {
    bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else if (player === X_CLASS) {
    bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

/* Dumb Ai */
/*
function bestSpot() {
  //let randomIndex = Math.floor(Math.random() * emptySquares().length);
  //let cellIndex = emptySquares()[randomIndex];
  let cellIndex = emptySquares(originalBoard)[0];
  return cellElements[cellIndex];
}
*/
