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
            gameLoop()
        })
        
        .catch(error => console.error('Error loading shapes:', error));
}

function generateNewTetromino() {
    const pieces = Object.keys(tetrominoes)
    const n = Math.floor(Math.random() * pieces.length)
    const randomPiece = pieces[n]
    gameState.currentTetromino = tetrominoes[randomPiece]
}







function clearBoard() {
    for (let i = 0; i < 200; i++) {
        const cell = document.getElementById(i);
        if (cell) {
            cell.style.backgroundColor = '';
        }
    }
}

let dropTimer = 0
function checkCollision(testY, testX, testPosition = position) {
    const rotation = gameState.currentTetromino.rotations[testPosition].shape;
    
    for (let row = 0; row < rotation.length; row++) {
        for (let col = 0; col < rotation[row].length; col++) {
            if (rotation[row][col] === 1) {
                const boardY = testY + row;
                const boardX = testX + col;
                
                if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                    return true; 
                }
                
                if (boardY >= 0 && gameState.board[boardY][boardX] !== 0) {
                    return true; 
                }
            }
        }
    }
    return false; 
}
function gameLoop() {
    if (!gameState.gameOver && !gameState.paused) {
        dropTimer += 222
        if (dropTimer > 1000) {
            if (!checkCollision(startY + 1, startX)) {
                startY++;
                moveTetromino(startY, startX);
            } else {
                placeTetromino();
                checkLines(); 
                spawnNewPiece();
            }
            dropTimer = 0
        }
    }
    requestAnimationFrame(gameLoop)
}
function setupControls() {
    document.addEventListener('keydown', (e) => {
        if (gameState.paused || gameState.gameOver) return

        switch (e.code) {
            case 'ArrowRight':
                if (!checkCollision(startY, startX + 1)) {
                    startX += 1;
                    moveTetromino(startY, startX);
                }
                break;
            case 'ArrowLeft':
                if (!checkCollision(startY, startX - 1)) {
                    startX -= 1;
                    moveTetromino(startY, startX);
                }
                break;
            case 'ArrowDown':
                if (!checkCollision(startY + 1, startX)) {
                    startY++;
                    moveTetromino(startY, startX);
                } else {
                    placeTetromino();
                    checkLines();
                    spawnNewPiece();
                }
                break;
            case 'ArrowUp':
                const newPosition = (position + 1) % 4;
                if (!checkCollision(startY, startX, newPosition)) {
                    position = newPosition;
                    moveTetromino(startY, startX);
                }
                break;
        }
    })
}

function moveTetromino(lStartY = startY, lStartX = startX) {
    clearBoard()

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (gameState.board[row][col] !== 0) {
                const index = row * COLS + col;
                const block = document.getElementById(index);
                if (block) block.style.backgroundColor = gameState.board[row][col];
            }
        }
    }

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

function placeTetromino() {
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

function spawnNewPiece() {
    startY = 0;
    startX = 4;
    position = 0;
    generateNewTetromino();
    
    if (checkCollision(startY, startX)) {
        gameState.gameOver = true;
        console.log("Game Over!");
    }
}
function checkLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (gameState.board[row].every(cell => cell !== 0)) {
            gameState.board.splice(row, 1);
            gameState.board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; 
        }
    }
    
    if (linesCleared > 0) {
        gameState.score += linesCleared * 100 * (gameState.level + 1);
    }
}