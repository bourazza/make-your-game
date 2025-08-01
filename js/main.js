import { menuFunction } from "./ui.js"

const COLS = 10
const ROWS = 20

let gameState = {
    board: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentTetromino: null,
    currentX: 4,
    currentY: 0,
    paused: false,
    gameOver: false,
    score: 0,
    level: 0,
}

const colors = {
    I: 'cyan',
    O: 'yellow',
    T: 'purple',
    S: 'green',
    Z: 'red',
    J: 'blue',
    L: 'orange'
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

for(let i=0;i<200;i++){
    let dive =document.createElement('div')
    dive.id=i
    tet[0].appendChild(dive)
    

}
for(let i=0;i<20;i++){
    let dive =document.createElement('div')
    dive.id=i
    expected[0].appendChild(dive)
    

}
