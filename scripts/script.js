const cellElements = document.querySelectorAll(".cell");
const boardElement = document.querySelector("#board");
const gameOverElement = document.querySelector("#game-over");
const gameOverTextElement = document.querySelector("#game-over-text");
const restartButton = document.querySelector("#restart-button");

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

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  originalBoard = Array.from(Array(9).keys());
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.addEventListener("click", turnClick);
  });
  setBoardHoverClass();
  gameOverElement.classList.remove("show");
}

function turnClick(e) {
  if (typeof originalBoard[e.target.id] !== "number") return;
  const cell = e.target;
  playerTurn(cell);
  if (checkWin(originalBoard, X_CLASS)) return;
  if (!isDraw(originalBoard)) playerTurn(bestSpot());
}

function playerTurn(spot) {
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(spot, currentClass);
  endTurn(originalBoard, currentClass);
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  originalBoard[cell.id] = currentClass;
}

function endTurn(originalBoard, currentClass) {
  if (checkWin(originalBoard, currentClass)) {
    endGame(false);
  } else if (isDraw(originalBoard)) {
    endGame(true);
  }
  swapTurns();
  setBoardHoverClass();
}

function checkWin(originalBoard, currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return originalBoard[index] === currentClass;
    });
  });
}

function endGame(draw) {
  if (draw) {
    gameOverTextElement.innerText = "Draw.";
  } else {
    gameOverTextElement.innerText = `${circleTurn ? "O's" : "X's"} win!`;
  }
  gameOverElement.classList.add("show");
}

function isDraw(originalBoard) {
  return originalBoard.every((currentValue) => {
    return currentValue === X_CLASS || currentValue === CIRCLE_CLASS;
  });
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

/* Dumb Ai */
function bestSpot() {
  let randomIndex = Math.floor(Math.random() * emptySquares().length);
  let cellIndex = emptySquares()[randomIndex];
  return cellElements[cellIndex];
}

function emptySquares() {
  return originalBoard.filter((currentValue) => {
    return typeof currentValue == "number";
  });
}
