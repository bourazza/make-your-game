import {gameState,updateStats,COLS, ROWS} from "./main.js"
// import {startX,startY} from "./gameLogique.js"
export function checkFullLines() {
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

