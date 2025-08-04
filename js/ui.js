import { gameState,clearBoard,generateNewTetromino,ROWS,COLS} from "./main.js"


export const menuFunction = () => {
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
        rGame()
    })
}

export const updateStats = (newScore, newLevel) => {
    const scoreCounter = document.getElementById('scoreValue')
    const levelCounter = document.getElementById('levelValue')

    scoreCounter.textContent = newScore;
    levelCounter.textContent = newLevel;
}
export function rGame() {
    gameState.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    gameState.score = 0;
    gameState.level = 1;
    updateStats(gameState.score,gameState.level )
    gameState.paused = false;
    gameState.gameOver = false;

    startX = 4;
    startY = 0;
    position = 0;
    k = 0;

    clearBoard();
    updateStats(0, 1);
    generateNewTetromino();
}

