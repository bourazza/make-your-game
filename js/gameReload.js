import{gameMenu} from "./main.js"

console.log("reload")
export function createBoard() {
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