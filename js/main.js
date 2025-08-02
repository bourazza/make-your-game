import { menuFunction } from "./ui.js"

const COLS = 10
const ROWS = 20
let position = 0
let startX = 4;
let startY = 0;
let tetrominoes = {};

let gameState = {
    board: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentTetromino: null,
    currentX: 4,
    currentY: 0,
    paused: false,
    gameOver: false,
    score: 0,
    level: 0,
}

document.addEventListener('DOMContentLoaded', () => {
    initialize();
})

function initialize() {
    createBoard()
    loadTetromioes()
    setupControls()
}

function createBoard() {
    let tet = document.getElementsByClassName('tetris-header')
    let expected = document.getElementsByClassName('tetris-predicted')

    for (let i = 0; i < 200; i++) {
        let dive = document.createElement('div')
        dive.id = i
        tet[0].appendChild(dive)
    }

    for (let i = 0; i < 20; i++) {
        let dive = document.createElement('div')
        dive.id = i
        expected[0].appendChild(dive)
    }
    menuFunction();
}

function loadTetromioes() {
    clearBoard()
    fetch('js/tetrisshapes.json').then(response => response.json())
        .then(data => {
            tetrominoes = data.tetrominoes;
            generateNewTetromino();
        })
        .catch(error => console.error('Error loading shapes:', error));
}

function generateNewTetromino() {
    const pieces = Object.keys(tetrominoes)
    const n = Math.floor(Math.random() * pieces.length)
    const randomPiece = pieces[n]
    console.log(randomPiece)
    gameState.currentTetromino = tetrominoes[randomPiece]
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        if (gameState.paused || gameState.gameOver) return

        switch (e.code) {
            case 'ArrowRight':
                if (startX < COLS - gameState.currentTetromino.rotations[position].width) {
                    startX += 1
                    if (startX < 0 || startX + getCurrentPiecewidth() > COLS) { break }
                    movePiece(startX)
                }
                break
            case 'ArrowLeft':
                if (startX > 0) {
                    startX -= 1
                    if (startX < 0) { break }
                    movePiece(startX)
                }
                break
            case 'ArrowDown':
                position -= 1;
                if (position < 0) {
                    position = 3;
                }
                movePiece(startX)
                break;
            case 'ArrowUp':
                position += 1
                if (position == 4) {
                    position = 0
                }
                movePiece(startX)
                break
        }
    })


}

function movePiece(lStartX) {
    clearBoard();
    const rotation = gameState.currentTetromino.rotations[position].shape;
    for (let row = 0; row < rotation.length; row++) {
        for (let col = 0; col < rotation[row].length; col++) {
            if (rotation[row][col] === 1) {
                const index = (startY + row) * COLS + (lStartX + col);
                gameState.currentX = lStartX;
                gameState.currentY = startY;
                // gameState.board[]
                const block = document.getElementById(index);

                if (block) block.style.backgroundColor = gameState.currentTetromino.color;
            }
        }
    }
}

function getCurrentPiecewidth() {
    return gameState.currentTetromino.rotations[position].width
}

function clearBoard() {
    for (let i = 0; i < 200; i++) {
        const cell = document.getElementById(i);
        if (cell) {
            cell.style.backgroundColor = '';
        }
    }
}
