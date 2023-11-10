"use strict";

// INDEX.HTML JS

function showInputScreen() {
  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("input-screen").style.display = "block";
}

function showInstructions() {
  document.getElementById("instructions-modal").style.display = "block";
}

function hideInstructions() {
  document.getElementById("instructions-modal").style.display = "none";
}

function startGame() {
  var player1Name = document.getElementById("player1Name").value;
  var player2Name = document.getElementById("player2Name").value;

  var startButton = document.getElementById("startButton"); // Get the start button element

  if (player1Name.trim() !== "" && player2Name.trim() !== "") {
    // Redirect to the game page with player names as URL query parameters
    var queryString = "?player1=" + encodeURIComponent(player1Name) + "&player2=" + encodeURIComponent(player2Name);
    window.location.href = "game.html" + queryString;
  } else {
    // Disable the button if any of the required fields are empty
    startButton.disabled = true;
  }

  // Enable the start button when all fields are filled
  startButton.disabled = false;
}


// END OF INDEX.HTML JS

// GAME.HTML JS

const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get("player1");
const player2Name = urlParams.get("player2");

if (player1Name) {
  document.getElementById("player1-name").textContent = player1Name;
}

if (player2Name) {
  document.getElementById("player2-name").textContent = player2Name;
}

// Set initial player
let currentPlayer = "X";

// Set initial game state
let gameState = ["", "", "", "", "", "", "", "", ""];

// Get the game board, message, and scoreboard elements
const gameBoard = document.getElementById("game-board");
const message = document.querySelector(".message");
const player1ScoreElement = document.getElementById("player1-score");
const player2ScoreElement = document.getElementById("player2-score");

// Initialize player scores
let player1Score = 0;
let player2Score = 0;

// Define the winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Update the message with the current player's turn
function updateMessage() {
  const urlParams = new URLSearchParams(window.location.search);
  const player1Name = urlParams.get("player1") || "Player 1";
  const player2Name = urlParams.get("player2") || "Player 2";
  message.textContent = `${currentPlayer === "X" ? player1Name : player2Name}'s Turn (${currentPlayer})`;
}

// Handle cell click event
function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = Array.from(gameBoard.children).indexOf(cell);

  // Check if the cell is empty and the game is still in progress
  if (gameState[cellIndex] === "" && !isGameWon() && !isGameDraw()) {
    // Update the cell with the current player's symbol
    cell.textContent = currentPlayer;

    // Update the game state
    gameState[cellIndex] = currentPlayer;

    // Check if the game is won
    if (isGameWon()) {
      highlightWinningLine();
      message.textContent = `${currentPlayer} wins!`;

      // Update player scores
      if (currentPlayer === "X") {
        player1Score++;
        player1ScoreElement.textContent = player1Score;
      } else {
        player2Score++;
        player2ScoreElement.textContent = player2Score;
      }
    } else if (isGameDraw()) {
      message.textContent = "It's a draw!";
    } else {
      // Switch to the next player
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateMessage();
    }
  }
}

// Check if the game is won
function isGameWon() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (gameState[a] !== "" && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return true;
    }
  }
  return false;
}

// Check if the game is drawn
function isGameDraw() {
  return gameState.every(cell => cell !== "");
}

// Highlight the winning line
function highlightWinningLine() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    const cells = Array.from(gameBoard.children);
    if (
      gameState[a] !== "" &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      cells[a].classList.add("winning-cell");
      cells[b].classList.add("winning-cell");
      cells[c].classList.add("winning-cell");
    }
  }
}

// Restart the game
function restartGame() {
  // Clear the game board
  Array.from(gameBoard.children).forEach(cell => {
    cell.textContent = "";
  });

  // Reset the game state
  gameState = ["", "", "", "", "", "", "", "", ""];

  // Remove the winning cell highlight
  gameBoard.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("winning-cell");
  });

  // Reset the current player
  currentPlayer = "X";

  // Update the message
  updateMessage();
}

// End the game and navigate back to the opening screen
function endGame() {
  window.location.href = "index.html";
}

// Initialize the message and scoreboard
updateMessage();
player1ScoreElement.textContent = player1Score;
player2ScoreElement.textContent = player2Score;
