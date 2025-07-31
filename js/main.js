let tet =document.getElementsByClassName('tetris-header')
let expected  =document.getElementsByClassName('tetris-predicted')

for(let i=0;i<200;i++){
    let dive =document.createElement('div')
    dive.id=i
    tet[0].appendChild(dive)
    

}
for(let i=0;i<50;i++){
    let dive =document.createElement('div')
    dive.id=i
    expected[0].appendChild(dive)
    

}
