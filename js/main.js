import { gameOver} from "./gmaeMenus.js"
import {createBoard, nextTetromino} from "./bordManupulation.js"
import { gameLoop ,setupControls, position,generateNewTetromino,next,setTimer} from "./gameLogique.js"

export const COLS = 10
export const ROWS = 20
export let pause = 0



export let tetrominoes = {};

export let gameState = {
    board: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentTetromino: null,
    paused: false,
    gameOver: false,
    score: 0,
    level: 1,
    dropSpeed: 0,
    next: null,
    Lives: 3
}

document.addEventListener('DOMContentLoaded', () => {
    startMenu()
})

function initialize() {
    createBoard()
    setupControls()
    loadTetromioes()
    setTimer()
    gameOver()
}



export function updatePreview() {
    nextTetromino('next', tetrominoes[next])
}

function loadTetromioes() {
    fetch('js/tetrominos.json').then(response => response.json())
        .then(data => {
            tetrominoes = data.tetrominoes;
            generateNewTetromino();
            gameLoop()
        })
        .catch(error => console.error('Error loading shapes:', error));
}



export function clearBoard() {
    for (let i = 0; i < 200; i++) {
        const cell = document.getElementById(i);
        if (cell) {
            cell.style.backgroundColor = '';
        }
    }
}

export function clearNext() {
    for (let i = 0; i < 20; i++) {
        const cell = document.getElementById("next" + i);
        if (cell) {
            cell.style.backgroundColor = '';
        }
    }
}

// checkCollision: returns true in case if there is a collision
export function checkCollision(tY, tX, testPosition = position) {
    const rotation = gameState.currentTetromino.rotations[testPosition].shape;

    for (let row = 0; row < rotation.length; row++) {
        for (let col = 0; col < rotation[row].length; col++) {
            if (rotation[row][col] === 1) {
                const boardY = tY + row;
                const boardX = tX + col;

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

export function startMenu() {
    const startMenu = document.getElementById("startMenu");
    const startBtn = document.getElementById("startBtn");

    startBtn.addEventListener("click", () => {
        startMenu.style.display = "none";
        initialize();
    });
}

export function pauseGame() {
    gameState.paused = !gameState.paused;
    const pauseMenu = document.querySelector('.pause-menu');
    if (pauseMenu) {
        pauseMenu.style.display = gameState.paused ? 'flex' : 'none';
    }
}



export const updateStats = () => {
    const scoreCounter = document.getElementById('scoreValue')
    const levelCounter = document.getElementById('levelValue')
    const life = document.getElementById('liveValue')
    scoreCounter.textContent = gameState.score;
    levelCounter.textContent = gameState.level;
    life.textContent = gameState.Lives
}

