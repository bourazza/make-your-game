import { gameMenu } from "./gameMenus.js"
import { gameState, COLS, ROWS } from "./main.js"
import { startX, startY, position } from "./gameLogique.js"
export function createBoard() {
    let tet = document.querySelector('.tetris-header')
    let expected = document.querySelector('.tetris-predicted')

    for (let i = 0; i < 200; i++) {
        let dive = document.createElement('div')
        dive.id = i
        tet.appendChild(dive)
    }

    for (let i = 0; i < 16; i++) {
        let div = document.createElement('div')
        div.id = "next" + i
        expected.appendChild(div)
    }

    gameMenu();
}
export function clearBlocks(y, x) {
    const rotation = gameState.currentTetromino.rotations[position].shape;
    for (let row = 0; row < rotation.length; row++) {
        for (let col = 0; col < rotation[row].length; col++) {
            if (rotation[row][col] == 1) {
                const index = (y + row) * COLS + (x + col)
                const block = document.getElementById(index)
                if (block) block.style.backgroundColor = ''
            }
        }
    }
}
export function moveTetromino(lStartY = startY, lStartX = startX) {
    const rotation = gameState.currentTetromino.rotations[position].shape;
    for (let row = 0; row < rotation.length; row++) {
        for (let col = 0; col < rotation[row].length; col++) {
            if (rotation[row][col] == 1) {
                const index = (lStartY + row) * COLS + (lStartX + col);
                const block = document.getElementById(index)
                if (block) block.style.backgroundColor = gameState.currentTetromino.color;
            }
        }
    }
}
export function placeTetromino() {
    const rotation = gameState.currentTetromino.rotations[position].shape

    for (let row = 0; row < rotation.length; row++) {
        for (let col = 0; col < rotation[row].length; col++) {
            if (rotation[row][col] == 1) {
                let x = startX + col
                let y = startY + row
                if (y >= 0) { gameState.board[y][x] = gameState.currentTetromino.color }
            }
        }
    }
}
export function nextTetromino(id, g) {
    const PREVIEW_COLS = 4;
    const PREVIEW_ROWS = 4;

    for (let i = 0; i < PREVIEW_ROWS * PREVIEW_COLS; i++) {
        const cell = document.getElementById(id + i);
        if (cell) cell.style.backgroundColor = "";
    }

    const shape = g.rotations[0].shape;
    const color = g.color;

    const offsetX = Math.floor((PREVIEW_COLS - shape[0].length) / 2);
    const offsetY = Math.floor((PREVIEW_ROWS - shape.length) / 2);


    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] == 1) {
                const index = (offsetY + row) * PREVIEW_COLS + (offsetX + col);
                const cell = document.getElementById(id + index);
                if (cell) cell.style.backgroundColor = color;
            }
        }
    }
}