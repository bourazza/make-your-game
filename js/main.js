
export const COLS = 10
export const ROWS = 20
export let pause = 0
let position = 0
let startX = 4
let startY = 0;
let randomPiece = null
let next = null
let tetrominoes = {};
let time = 0;

let gameState = {
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
}

function createBoard() {
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

function updatePreview() {
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

export function generateNewTetromino() {
    const pieces = Object.keys(tetrominoes)
    if (randomPiece === null) {
        randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
        next = pieces[Math.floor(Math.random() * pieces.length)]
    } else {
        randomPiece = next
        next = pieces[Math.floor(Math.random() * pieces.length)]
    }
    gameState.currentTetromino = tetrominoes[randomPiece]
    updatePreview()
}

export function clearBoard() {
    for (let i = 0; i < 200; i++) {
        const cell = document.getElementById(i);
        if (cell) {
            cell.style.backgroundColor = '';
        }
    }
}

function clearNext() {
    for (let i = 0; i < 20; i++) {
        const cell = document.getElementById("next" + i);
        if (cell) {
            cell.style.backgroundColor = '';
        }
    }
}

// checkCollision: returns true in case if there is a collision
function checkCollision(tY, tX, testPosition = position) {
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

export function gameLoop() {
    if (!gameState.gameOver && !gameState.paused) {
        gameState.dropSpeed += 22
        if (gameState.dropSpeed > getUpdatedInterval()) {
            if (!checkCollision(startY + 1, startX)) {
                startY++;
                clearBlocks(startY - 1, startX)
                moveTetromino(startY, startX);
            } else {
                placeTetromino();
                checkFullLines();
                spawnNewPiece();
            }
            gameState.dropSpeed = 0
        }
    }
    requestAnimationFrame(gameLoop)
}

function getUpdatedInterval() {
    const bSpeed = 1000
    const increaseSpeed = 60
    return Math.max(300, bSpeed - (gameState.level * increaseSpeed))
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        if ((gameState.paused && e.code != 'KeyP') || gameState.gameOver) return
        switch (e.code) {
            case 'ArrowRight':
                if (!checkCollision(startY, startX + 1)) {
                    startX += 1;
                    clearBlocks(startY, startX - 1)
                    moveTetromino(startY, startX);
                }
                break;
            case 'ArrowLeft':
                if (!checkCollision(startY, startX - 1)) {
                    startX -= 1;
                    clearBlocks(startY, startX + 1)
                    moveTetromino(startY, startX);
                }
                break;
            case 'ArrowDown':
                if (checkCollision(startY + 1, startX)) {
                    placeTetromino();
                    checkFullLines();
                    spawnNewPiece();
                    break;
                } else {
                    startY += 1;
                    clearBlocks(startY - 1, startX)
                    moveTetromino(startY, startX);
                    gameState.score += 2
                    updateStats(gameState.score, gameState.level)
                    break;
                }
            case 'ArrowUp':
                const newPosition = (position + 1) % 4;
                if (!checkCollision(startY, startX, newPosition)) {
                    clearBlocks(startY, startX);
                    position = newPosition;
                    moveTetromino(startY, startX);
                } else if (!checkCollision(startY, startX - 1, newPosition)) {
                    clearBlocks(startY, startX);
                    startX -= 1;
                    position = newPosition;
                    moveTetromino(startY, startX);
                } else if (!checkCollision(startY, startX - 3, newPosition)) {
                    clearBlocks(startY, startX);
                    startX -= 3;
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

function clearBlocks(y, x) {
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

function nextTetromino(id, g) {
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
        gameState.Lives = gameState.Lives - 1;
        if (gameState.Lives != 0) {
            let life = document.querySelector('#liveValue')
            life.textContent = gameState.Lives;
            gameState.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
            clearBoard()
        } else {
            gameState.gameOver = true;
            console.log("Game Over!");
        }

    }
}

function checkFullLines() {
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (gameState.board[row].every(cell => cell !== 0)) {
            for (let col = 0; col < COLS; col++) {
                const index = row * COLS + col;
                const block = document.getElementById(index);
                if (block) block.style.backgroundColor = '';
            }
            gameState.board.splice(row, 1);
            gameState.board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++;
        }
    }

    if (linesCleared > 0) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const index = row * COLS + col;
                const block = document.getElementById(index);
                if (block) {
                    block.style.backgroundColor = gameState.board[row][col] || '';
                }
            }
        }

        gameState.score += linesCleared * 100 * (gameState.level + 1);
        gameState.level += linesCleared;
        updateStats(gameState.score, gameState.level);
    }
}

export function startMenu() {
    const startMenu = document.getElementById("startMenu");
    const startBtn = document.getElementById("startBtn");

    startBtn.addEventListener("click", () => {
        startMenu.style.display = "none";
        initialize();
    });
}

function pauseGame() {
    gameState.paused = !gameState.paused;
    const pauseMenu = document.querySelector('.pause-menu');
    if (pauseMenu) {
        pauseMenu.style.display = gameState.paused ? 'flex' : 'none';
    }
}

function gameMenu() {
    const menuButton = document.querySelector('.menu-button')
    const pauseMenu = document.querySelector('.pause-menu')
    const continueButton = document.querySelector('.continue-button')
    const restartButton = document.querySelector('.restart-button')

    menuButton.addEventListener('click', () => {
        pauseMenu.style.display = 'flex'
    })

    continueButton.addEventListener('click', () => {
        pauseMenu.style.display = 'none'
        gameState.paused = false
    })


    restartButton.addEventListener('click', () => {
        pauseMenu.style.display = 'none'
        restartGame()
    })
}


function setTimer() {
    const timeElement = document.querySelector('#TimeValue time');

    function formatTime(duration) {
        const minutes = Math.floor(duration / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((duration % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = Math.floor(duration % 1000).toString().padStart(3, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }

    function updateTimer() {
        if (!gameState.paused && !gameState.gameOver) {
            time += 10;
            timeElement.textContent = formatTime(time);
            timeElement.setAttribute('datetime', formatTime(time));
        }
    }
    setInterval(updateTimer, 10);
}


const updateStats = () => {
    const scoreCounter = document.getElementById('scoreValue')
    const levelCounter = document.getElementById('levelValue')
    const life = document.getElementById('liveValue')
    scoreCounter.textContent = gameState.score;
    levelCounter.textContent = gameState.level;
    life.textContent = gameState.Lives
}

function restartGame() {
    gameState.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    gameState.score = 0;
    gameState.level = 1;
    gameState.dropSpeed = 0;
    gameState.paused = false;
    gameState.gameOver = false;
    gameState.Lives = 3;
    randomPiece = null;
    next = null;
    time = 0;
    startX = 4;
    startY = 0;
    clearNext();
    clearBoard();
    updateStats(0, 0);
    generateNewTetromino();
    moveTetromino(startY, startX)
}


function gameOver() {
    const menu = document.createElement("div");
    menu.id = "gameOverMenu";
    menu.className = "game-over-menu";
 

    menu.innerHTML = `
        <div >
            <h2>Game Over</h2>
            <p id="finalScore">Score: 0</p>
            <p id="finalLevel">Level: 0</p>
            <button id="restartGameBtn">Restart</button>
        </div>
    `;

    document.body.appendChild(menu);
}

function displayGameover(score, level) {
    const menu = document.getElementById("gameOverMenu");
    document.getElementById("finalScore").textContent = `Score: ${score}`;
    document.getElementById("finalLevel").textContent = `Level: ${level}`;
    menu.style.display = "flex";

    document.getElementById("restartGameBtn").onclick = () => {
        menu.style.display = "none";
        rGame();
    };
}
