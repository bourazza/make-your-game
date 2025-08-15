import {gameState} from "./main.js"
import {restartGame} from "./gameLogique.js"



export function gameMenu() {
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
export function gameOver() {
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

export function displayGameover(score, level) {
    const menu = document.getElementById("gameOverMenu");
    document.getElementById("finalScore").textContent = `Score: ${score}`;
    document.getElementById("finalLevel").textContent = `Level: ${level}`;
    menu.style.display = "flex";

    document.getElementById("restartGameBtn").onclick = () => {
        menu.style.display = "none";
        
        restartGame()
    };
}