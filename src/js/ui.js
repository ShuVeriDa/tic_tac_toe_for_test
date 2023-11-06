const gameBoard = document.querySelector("#gameBoard")
const infoDisplay = document.querySelector("#info")

export function updateBoardColors(color) {
  const allSquares = document.querySelectorAll('.square');
  gameBoard.style.borderColor = color;
  infoDisplay.style.color = color;
  allSquares.forEach(square => {
    square.style.borderColor = color;
  });
}