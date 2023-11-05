const gameBoard = document.querySelector("#gameBoard")
const infoDisplay = document.querySelector("#info")
const newGameButton = document.querySelector("#newGame");
const multiplayer = document.querySelector("#multiplayer");
const singlePlayer = document.querySelector("#singlePlayer");
const selectedMode = document.querySelector(".selectedMode");
const selectMode = document.querySelector(".selectMode");
const mods = document.querySelector(".mods");
const easyModeButton = document.querySelector("#easyMode");
const hardModeButton = document.querySelector("#hardMode");

let startCells = [
  '', '', '', '', '', '', '', '', ''
]

let go = "cross"
let mode
let level
let message = ''
let state = 'waiting'


easyModeButton.addEventListener('click', () => {
  level = 'easy'; // Установите режим на "простой"
  gameBoard.style.display = 'flex';
  startSinglePlayerGame();
});

hardModeButton.addEventListener('click', () => {
  level = 'hard'; // Установите режим на "сложный"
  gameBoard.style.display = 'flex';
  startSinglePlayerGame();
});

function setupGame() {
  multiplayer.addEventListener('click', startMultiplayerGame);
  singlePlayer.addEventListener('click', () => {
    mods.style.display = 'flex'
    gameBoard.style.display = '';
    selectedMode.style.display = 'none'
    newGameButton.style.display = 'none'
    infoDisplay.style.display = 'none'
  });
  newGameButton.addEventListener("click", startNewGameClearLS);

}

function startSinglePlayerGame() {
  mode = 'singlePlayer'
  gameBoard.style.display = 'flex';
  selectedMode.style.display = 'block'
  newGameButton.style.display = 'block'
  infoDisplay.style.display = 'block'
  selectedMode.textContent = `Одиночная игра (${level} режим)`;
  createBoard();
  startNewGame();
}

function startMultiplayerGame() {
  mods.style.display = 'none'
  mode = 'multiplayer';
  gameBoard.style.display = 'flex';
  selectedMode.textContent = "Многопользовательская игра";
  createBoard();
  continueGame();
  loadGame();

  const savedGameState = localStorage.getItem("gameState");
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);
    state = gameState.state
    go = gameState.currentPlayer
    message = gameState.message
  }

  infoDisplay.textContent = message;
}

function createBoard() {
  startCells.forEach((_cell, i) => {
    const cellElement = document.createElement('div')
    cellElement.classList.add('square')
    cellElement.id = i
    cellElement.addEventListener('click', addGo)
    gameBoard.append(cellElement)
  })
}

function addGo(e) {
  if (state === 'winCross' || state === "winCircle" || state === 'draw') {
    return
  }

  if (go === "cross") {
    updateBoardColors('blue')
  }

  if (go === "circle") {
    updateBoardColors('red')
  }

  const goDisplay = document.createElement('div')
  goDisplay.classList.add(go)
  e.target.append(goDisplay)
  go = go === 'cross' ? "circle" : "cross"
  message = `Теперь ходит ${go === 'circle' ? "нолик" : "крестик"}`
  infoDisplay.textContent = message
  e.target.removeEventListener('click', addGo)

  checkScore()

  if (mode === 'multiplayer') saveGame();
}

function checkScore() {
  const allSquares = document.querySelectorAll('.square')

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  winningCombos.forEach(array => {
    const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains('cross'))

    if (crossWins) {
      state = 'winCross'
      message = 'Поздравляю крестик выиграл'
      infoDisplay.textContent = message

      updateBoardColors("red")

      allSquares.forEach(square => square.replaceWith(square.cloneNode(true)))
      return
    }
  })

  winningCombos.forEach(array => {
    const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains('circle'))

    if (circleWins) {
      state = 'winCircle'
      message = 'Поздравляю Нолик выиграл'
      infoDisplay.textContent = message

      updateBoardColors("blue")

      allSquares.forEach(square => square.replaceWith(square.cloneNode(true)))
      return
    }
  })

  checkDraw()
}

function startNewGameClearLS() {
  startNewGame()

  updateBoardColors('red')

  localStorage.removeItem("gameState");
  state = 'gameOn'
}

function continueGame() {
  gameBoard.innerHTML = "";
  newGameButton.style.display = 'block'

  startCells.forEach((_cell, i) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("square");
    cellElement.id = i;
    cellElement.addEventListener("click", addGo);
    gameBoard.append(cellElement);
  });
}

function startNewGame() {
  state = 'gameOn'
  message = "Крестик ходит первым";
  infoDisplay.textContent = message;
  gameBoard.innerHTML = "";
  newGameButton.style.display = 'block'
  gameBoard.style.borderColor = 'red'

  startCells.forEach((_cell, i) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("square");
    cellElement.id = i;
    cellElement.addEventListener("click", addGo);
    gameBoard.append(cellElement);
  });

  go = "cross";
}

function saveGame() {
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

function loadGame() {
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

  if(state === 'gameOn') {
    if(go === 'cross') {
      message = 'Теперь ходит крестик'
    }
    if(go === 'circle') {
      message = 'Теперь ходит нолик'
    }
  }

  infoDisplay.textContent = message;
}

function checkDraw() {
  const allSquares = document.querySelectorAll('.square');

  const isDraw = Array.from(allSquares).every(square => {
    return square.firstChild && (square.firstChild.classList.contains('cross') || square.firstChild.classList.contains('circle'));
  });

  if (isDraw) {
    state = 'draw'
    message = 'Ничья!';
    infoDisplay.textContent = message;
    updateBoardColors('green')
  }
}

function updateBoardColors(color) {
  const allSquares = document.querySelectorAll('.square');
  gameBoard.style.borderColor = color;
  infoDisplay.style.color = color;
  allSquares.forEach(square => {
    square.style.borderColor = color;
  });
}

setupGame()
