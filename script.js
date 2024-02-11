import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();


function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches ||
      evt.originalEvent.touches;
}

function handleTouchStart(evt) {
  const firstTouch =  getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

async function handleTouchMove(evt) {
  if ( ! xDown || ! yDown ) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
    if ( xDiff > 0 ) {
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      const newTile = new Tile(gameBoard);
      grid.getRandomEmptyCell().linkTile(newTile);
    } else {
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();

      const newTile = new Tile(gameBoard);
      grid.getRandomEmptyCell().linkTile(newTile);

    }
  } else {
    if ( yDiff > 0 ) {
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();

      const newTile = new Tile(gameBoard);
      grid.getRandomEmptyCell().linkTile(newTile);


    } else {
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      const newTile = new Tile(gameBoard);
      grid.getRandomEmptyCell().linkTile(newTile);

    }
  }

  /* reset values */
  xDown = null;
  yDown = null;


};


async function handleInput(event) {
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;
    default:
      setupInputOnce();
      return;
  }

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd()
    alert("Try again!")
    return;
  }

  setupInputOnce();
}

async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach(group => slideTilesInGroup(group, promises));

  await Promise.all(promises);
  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles()
  });
}

function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

async function canMoveUp() {
  return await canMove(grid.cellsGroupedByColumn);
}

async function canMoveDown() {
  return await canMove(grid.cellsGroupedByReversedColumn);
}

async function canMoveLeft() {
  return await canMove(grid.cellsGroupedByRow);
}

async function canMoveRight() {
  return await canMove(grid.cellsGroupedByReversedRow);
}

async function canMove(groupedCells) {
  return await groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}