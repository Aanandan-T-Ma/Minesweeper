const game_grid = document.querySelector('.game-grid')
const mines_left = document.querySelector('#mines-left')
const modal = document.querySelector('.modal')
const mines_number = document.getElementById('mines-number')
const minesDiv = document.querySelector('.mines')
const row_cols = 10
var mines, opened
var grid = []

renderGrid()
openModal()

startGame = () => {
    opened = 0
    renderGrid()
    fixMines()
    placeMines()
    closeModal()
    //console.table(grid)
    //console.log(mines)
}

endGame = (msg) => {
    document.getElementById('msg').innerText = msg
    document.getElementById('start-btn').innerText = 'Play Again'
    if(msg === 'Game Over!')
        document.querySelector('.content').style.backgroundColor = 'rgb(241, 31, 31)'
    else
        document.querySelector('.content').style.backgroundColor = 'lightgreen'
    openModal()
}

function renderGrid(){
    game_grid.innerHTML = ''
    grid = []
    for(let i=0;i<row_cols;i++){
        let row = []
        for(let j=0;j<row_cols;j++){
            let div = document.createElement('div')
            div.id = 'cell-'+i+j
            div.setAttribute('onclick', 'show(event)')
            div.setAttribute('oncontextmenu', 'flag(event)')
            game_grid.appendChild(div)
            row.push(0)
        }
        grid.push(row)
    }
}

function placeMines(){
    for(let i=0;i<mines;i++){
        let row = Math.floor(Math.random() * row_cols)
        let col = Math.floor(Math.random() * row_cols)
        grid[row][col] = -1
    }
    mines = 0
    for(let i=0;i<row_cols;i++){
        for(let j=0;j<row_cols;j++){
            if(grid[i][j] == -1) mines++
            else grid[i][j] = countMines(i, j)
        }
    }
    mines_left.innerHTML = mines
    minesDiv.style.display = 'block'
}

function countMines(i, j){
    let m = 0
    if(i>0 && j>0 && grid[i-1][j-1] == -1) m++
    if(i>0 && grid[i-1][j] == -1) m++
    if(j>0 && grid[i][j-1] == -1) m++
    if(i>0 && j<row_cols-1 && grid[i-1][j+1] == -1) m++
    if(i<row_cols-1 && j>0 && grid[i+1][j-1] == -1) m++
    if(i<row_cols-1 && grid[i+1][j] == -1) m++
    if(j<row_cols-1 && grid[i][j+1] == -1) m++
    if(i<row_cols-1 && j<row_cols-1 && grid[i+1][j+1] == -1) m++
    return m
}

function show(event){
    let id = event.target.id
    let i = Number(id[5])
    let j = Number(id[6])
    let cell = document.getElementById(id)
    if(cell.innerHTML) return
    if(grid[i][j] != -1){
        cell.innerHTML = grid[i][j]
        cell.style.backgroundColor = 'rgb(180, 180, 180)'
        opened++
        if(opened === row_cols*row_cols - mines){
            showMines()
            endGame('You won!')
        }
    }
    else{
        cell.style.backgroundColor = 'red'
        cell.innerHTML = '&#128163;'
        endGame('Game Over!')
    }
}

function flag(event){
    event.preventDefault()
    let cell = document.getElementById(event.target.id)
    if(cell.innerHTML && !isNaN(cell.innerHTML)) return
    if(cell.innerHTML){
        cell.innerHTML = ''
        cell.style.backgroundColor = 'rgb(119, 116, 116)'
    }
    else{
        cell.innerHTML = '&#128681;'
        cell.style.backgroundColor = 'rgb(100, 50, 50)'
    }
}

function showMines(){
    for(let i=0;i<row_cols;i++){
        for(let j=0;j<row_cols;j++){
            if(grid[i][j] == -1){
                let cell = document.getElementById('cell-'+i+j)
                cell.style.backgroundColor = 'red'
                cell.innerHTML = '&#128163;'
            }
        }
    }
}

function openModal(){
    modal.classList.add('open-modal')
    modal.classList.remove('close-modal')
}

function closeModal(){
    modal.classList.remove('open-modal')
    modal.classList.add('close-modal')
}

function fixMines(){
    mines = Number(mines_number.value)
}