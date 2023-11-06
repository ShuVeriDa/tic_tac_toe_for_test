import {updateBoardColors} from "./ui.js";
import {addGo, startCells} from "./main.js";
const infoDisplay = document.querySelector("#info")

export function loadGame(go, state, message) {
  const savedGameState = localStorage.getItem("gameState");
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);

    // Восстановление состояния игры
    startCells.length = 0;
    startCells.push(...gameState.cells);
    go = gameState.currentPlayer;
    state = gameState.state
    message = gameState.message

    // Восстановление игрового поля
    const squareElements = document.querySelectorAll(".square");
    squareElements.forEach((square, i) => {
      square.innerHTML = "";
      if (gameState.cells[i] === "cross" || gameState.cells[i] === "circle") {
        const goDisplay = document.createElement("div");
        goDisplay.classList.add(gameState.cells[i]);
        square.appendChild(goDisplay);
        square.removeEventListener("click", addGo);
      }
    });
  }

  if (state === 'draw') {
    message = 'Ничья'
    updateBoardColors('green')
  }
  if (state === 'winCross') {
    message = 'Поздравляю крестик выиграл'
    updateBoardColors('red')
  }
  if (state === 'winCircle') {
    message = 'Поздравляю нолик выиграл'
    updateBoardColors('blue')
  }
  if (state === 'waiting') {
    message = "";
  }

  if (state === 'gameOn') {
    if (go === 'cross') {
      message = 'Теперь ходит крестик'
    }
    if (go === 'circle') {
      message = 'Теперь ходит нолик'
    }
  }

  infoDisplay.textContent = message;
}

export function saveGame(go, state, message, mode) {
  console.log(state)
  const gameState = {
    cells: [],
    currentPlayer: go,
    state: state,
    mode: mode,
    message: message
  };

  const squareElements = document.querySelectorAll(".square");
  squareElements.forEach((square) => {
    if (square.firstChild?.classList.contains("cross")) {
      gameState.cells.push("cross");
    } else if (square.firstChild?.classList.contains("circle")) {
      gameState.cells.push("circle");
    } else {
      gameState.cells.push("");
    }
  });

  localStorage.setItem("gameState", JSON.stringify(gameState));
}