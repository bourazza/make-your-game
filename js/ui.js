document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu')
    const parentContainer = document.getElementById('container')

    menuButton.addEventListener('onClick', () => {
        const pauseMenu = document.createElement('div')
        pauseMenu.setAttribute('class', 'pause-menu')

        const continueButton = document.createElement('button')
        continueButton.textContent = 'Continue'

        const restartButton = document.createElement('button')
        restartButton.textContent = 'Restart'

        pauseMenu.appendChild(continueButton)
        pauseMenu.appendChild(restartButton)
    })
})
