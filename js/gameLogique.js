import { gameState, checkCollision, updateStats, ROWS, COLS, clearBoard, pauseGame, tetrominoes, updatePreview, clearNext } from "./main.js"
import { clearBlocks, moveTetromino, placeTetromino } from "./bordManupulation.js"
import { displayGameover } from "./gameMenus.js"
import { checkFullLines } from "./stat.js"
export let startX = 3;
export let startY = 0;
export let position = 0
export let randomPiece = null
export let next = null
export let time = 0;


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
export function setupControls() {
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

export function spawnNewPiece() {
    startY = 0;
    startX = 3;
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
            displayGameover(gameState.score, gameState.level)
            console.log("Game Over!");
        }

    }
}
export function restartGame() {
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
    startX = 3;
    startY = 0;
    clearNext();
    clearBoard();
    updateStats(0, 0);
    generateNewTetromino();
    moveTetromino(startY, startX)
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

export function setTimer() {
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
