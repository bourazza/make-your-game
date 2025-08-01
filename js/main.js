let tet =document.getElementsByClassName('tetris-header')
let expected  =document.getElementsByClassName('tetris-predected')

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
const COLS = 10;

fetch('./js/tetrisshapse.json')
  .then(response => response.json())
  .then(data => {
    const tetrominoes = data.tetrominoes;

    const shape = tetrominoes.T; 

    const startX = 4;
    const startY = 0;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const index = (startY + row) * COLS + (startX + col);
          const block = document.getElementById(index);
          if (block) block.style.backgroundColor = 'cyan'; 
        }
      }
    }
  })
  .catch(error => console.error('Error loading shapes:', error));