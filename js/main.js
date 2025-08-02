import { menuFunction } from "./ui.js"

const COLS = 10
const ROWS = 20
let position =0

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

    for (let i = 0; i < 200; i++) {
        let dive = document.createElement('div')
        dive.id = i
        tet[0].appendChild(dive)
    }

    for (let i = 0; i < 50; i++) {
        let dive = document.createElement('div')
        dive.id = i
        expected[0].appendChild(dive)
    }
    menuFunction();
}

function loadTetromioes() {
    clearBoard()
    fetch('js/tetrisshapse.json').then(response => response.json())
        .then(data => {
            const tetrominoes = data.tetrominoes;
            var shape = tetrominoes.L;
            console.log(shape)
            const startX = 4;
            const startY = 0;
            
const rotation = shape[position];
            for (let row = 0; row < rotation.length; row++) {
                for (let col = 0; col < rotation[row].length; col++) {
                    if (rotation[row][col] === 1) {
                        console.log('f')
                        const index = (startY + row) * COLS + (startX + col);
                        const block = document.getElementById(index);
                        if (block) block.style.backgroundColor = 'cyan';
                    }
                }
            }
        })
        .catch(error => console.error('Error loading shapes:', error));
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        if (gameState.paused || gameState.gameOver) return

        switch (e.code) {
            case 'ArrowRight':

               
            case 'ArrowLeft':
                break
             case 'ArrowDown':
        position -= 1;
        if (position < 0) {
            position = 3; 
        }
        loadTetromioes();
        break;
            case 'ArrowUp':
                position+=1
                if(position==4){
                    position=0
                }
                loadTetromioes() 
        }
    })

    
}
function clearBoard() {
  for (let i = 0; i < 200; i++) {
    const cell = document.getElementById(i);
    if (cell) {
      cell.style.backgroundColor = '';
    }
  }
}
