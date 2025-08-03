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
    })

    restartButton.addEventListener('click', () => {
        pauseMenu.style.display = 'none'
        restartGame()
    })
}

export const updateStats = (newScore, newLevel) => {
    const scoreCounter = document.getElementById('scoreValue')
    const levelCounter = document.getElementById('levelValue')

    scoreCounter.textContent = newScore;
    levelCounter.textContent = newLevel;
}
