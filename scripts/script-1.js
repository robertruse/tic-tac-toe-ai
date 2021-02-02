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
    cell.removeEventListener("click", turnClick);
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
  if (checkDraw(originalBoard)) return;
  setTimeout(() => {
    playerTurn(bestSpot());
  }, 200);
}

function playerTurn(cell) {
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  endTurn(originalBoard, currentClass);
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  originalBoard[cell.id] = currentClass;
}

function endTurn(board, currentClass) {
  if (checkWin(board, currentClass)) declareWinner(currentClass);
  if (checkDraw(board)) declareWinner(false);
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
      gameOverTextElement.innerText = "X's win!";
      break;
    case CIRCLE_CLASS:
      gameOverTextElement.innerText = "O's win!";
      break;
    default:
      gameOverTextElement.innerText = "Draw.";
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

/* Dumb Ai */
/*
function bestSpot() {
  //let randomIndex = Math.floor(Math.random() * emptySquares().length);
  //let cellIndex = emptySquares()[randomIndex];
  let cellIndex = emptySquares(originalBoard)[0];
  return cellElements[cellIndex];
}
*/

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
      let result = minimax(newBoard, X_CLASS);
      move.score = result.score;
    } else if (player == X_CLASS) {
      let result = minimax(newBoard, CIRCLE_CLASS);
      move.score = result.score;
    }
    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;

  if (player === CIRCLE_CLASS) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else if (player === X_CLASS) {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
