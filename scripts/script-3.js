const cellElements = document.querySelectorAll(".cell");
const boardElement = document.querySelector("#board");
const gameOverElement = document.querySelector("#game-over");
const gameOverTextElements = document.querySelectorAll(".game-over-text");
const restartButton = document.querySelector("#restart-button");

const toggleButton = document.querySelector("#toggle-button");
const menuElement = document.querySelector("#nav-menu");

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
let numberOfPlayers;

toggleButton.addEventListener("click", openMenu);

function openMenu(e) {
  toggleButton.classList.toggle("show");
  menuElement.classList.toggle("show");
}
