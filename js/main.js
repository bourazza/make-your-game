import { menuFunction, updateStats } from "./ui.js"

export const COLS = 10
export const ROWS = 20
let position = 0
let startX = 4;
let startY = 0;
var k=0
   let randomPiece =null
     let next =null
let tetrominoes = {};

export let gameState = {
    board: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentTetromino: null,
    paused: false,
    gameOver: false,
    score: 0,
    level: 1,
    dropSpeed: 0,
    next :null
}

document.addEventListener('DOMContentLoaded', () => {
    startMenu()
})

function initialize() {
    createBoard()
    loadTetromioes()
    setupControls()
}

 function createBoard() {
    let tet = document.getElementsByClassName('tetris-header')
    let expected = document.getElementsByClassName('tetris-predicted')
        let expected2 = document.getElementsByClassName('tetris-predected2')


    for (let i = 0; i < 200; i++) {
        let dive = document.createElement('div')
        dive.id = i
        tet[0].appendChild(dive)
    }

    for (let i = 0; i < 20; i++) {
        let dive = document.createElement('div')
        dive.id = "next"+i
        expected[0].appendChild(dive)
    }
     for (let i = 0; i < 20; i++) {
        let dive = document.createElement('div')
        dive.id = "next2"+i
        expected2[0].appendChild(dive)
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

export function generateNewTetromino() {
     const pieces = Object.keys(tetrominoes)
  
    if(k ===0){
const n = Math.floor(Math.random() * pieces.length)
    randomPiece = pieces[n]
    next=pieces[ Math.floor(Math.random() * pieces.length)]
    console.log(next)
    k=1

    }else{
        randomPiece =next
        console.log(randomPiece)
        next=pieces[ Math.floor(Math.random() * pieces.length)]


    }
   
    
    gameState.currentTetromino = tetrominoes[randomPiece]
    console.log(gameState.currentTetromino )
}

export function clearBoard() {
    for (let i = 0; i < 200; i++) {
        const cell = document.getElementById(i);
        if (cell) {
            cell.style.backgroundColor = '';
        }
    }
}

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

let dropSpeed = 0
function gameLoop() {
    if (!gameState.gameOver && !gameState.paused) {
        dropSpeed += 22
        if (dropSpeed > getUpdatedInterval()) {
            if (!checkCollision(startY + 1, startX)) {
                startY++;
                moveTetromino(startY, startX);
                nextTetromino('next',tetrominoes[randomPiece])
                 nextTetromino('next2',tetrominoes[next])
            } else {
                placeTetromino();
                checkLines();
                spawnNewPiece();
            }
            dropSpeed = 0
        }
    }
    requestAnimationFrame(gameLoop)
}

function getUpdatedInterval() {
    const bSpeed = 1000
    const increaseSpeed = 60
    return Math.max(100, bSpeed - (gameState.level * increaseSpeed))
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
                    startY += 1;
                    moveTetromino(startY, startX);
                    gameState.score += 2
                    updateStats(gameState.score, gameState.level)
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
             case 'KeyP':
                pauseGame() 
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
function nextTetromino(id,g){
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
        gameState.level += linesCleared

        updateStats(gameState.score, gameState.level)
    }
}
export function startMenu() {
    const startMenu = document.getElementById("startMenu");
    const startBtn = document.getElementById("startBtn");
    const countdown = document.getElementById("countdown");

    startBtn.addEventListener("click", () => {
        startMenu.style.display = "none";
        startCountdown();
    });

    function startCountdown() {
        let count = 3;
        countdown.style.display = "block";
        countdown.textContent = count;

        const interval = setInterval(() => {
            count--;
            if (count >= 0) {
                countdown.textContent = count;
            } else {
                clearInterval(interval);
                countdown.style.display = "none";
                   initialize();

            }
        }, 1000);
    }
}
function pauseGame() {
    gameState.paused = !gameState.paused;

    const pauseMenu = document.querySelector('.pause-menu');
    if (pauseMenu) {
        pauseMenu.style.display = gameState.paused ? 'flex' : 'none';
    }
}
    