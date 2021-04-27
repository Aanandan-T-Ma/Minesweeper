const game_grid = document.querySelector('.game-grid')
const mines_left = document.querySelector('#mines-left')
const modal = document.querySelector('.modal')
const game_area = document.querySelector('.game-area')
const mines_number = document.getElementById('mines-number')
const minesDiv = document.querySelector('.mines')
const row_cols = 10
var mines, opened
var grid = [], visited = []

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
        document.querySelector('#msg').style.color = 'red'
    else
        document.querySelector('#msg').style.color = 'green'
    openModal()
}

function renderGrid(){
    game_grid.innerHTML = ''
    grid = []
    visited = []
    for(let i=0;i<row_cols;i++){
        let row = []
        let v = []
        for(let j=0;j<row_cols;j++){
            let div = document.createElement('div')
            div.id = 'cell-'+i+j
            div.setAttribute('onclick', 'show(event)')
            div.setAttribute('oncontextmenu', 'flag(event)')
            game_grid.appendChild(div)
            row.push(0)
            v.push(false)
        }
        grid.push(row)
        visited.push(v)
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
        showAround(i, j, 0)
        if(opened === row_cols*row_cols - mines){
            showMines()
            endGame('You won!')
        }
    }
    else{
        cell.style.backgroundColor = 'red'
        cell.innerHTML = '&#128163;'
        cell.classList.add('show-bomb')
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
        cell.style.backgroundColor = 'black'
    }
}

function showMines(){
    for(let i=0;i<row_cols;i++){
        for(let j=0;j<row_cols;j++){
            if(grid[i][j] == -1){
                let cell = document.getElementById('cell-'+i+j)
                cell.innerHTML = '&#128163;'
                cell.style.backgroundColor = 'black'
            }
        }
    }
}

function openModal(){
    modal.classList.add('open-modal')
    modal.classList.remove('close-modal')
    game_area.style.filter = 'blur(2px)'
}

function closeModal(){
    modal.classList.remove('open-modal')
    modal.classList.add('close-modal')
    game_area.style.filter = 'blur(0px)'
}

function fixMines(){
    mines = Number(mines_number.value)
}

function showAround(i, j, delay){
    //console.log(i, j)
    if(i < 0 || j < 0 || i == row_cols || j == row_cols || visited[i][j])
        return
    let cell = document.getElementById('cell-'+i+j)
    //console.log(cell.innerHTML)
    if(cell.innerHTML == '🚩') return
    visited[i][j] = true
    if(grid[i][j] != -1){
        cell.classList.add('show-cell')
        cell.style.animationDelay = delay + 's'
        opened++
    }
    if(grid[i][j] > 0)
        cell.innerHTML = grid[i][j]
    else if(grid[i][j] == 0){
        delay += .05
        showAround(i-1, j-1, delay)
        showAround(i-1, j, delay)
        showAround(i-1, j+1, delay)
        showAround(i, j-1, delay)
        showAround(i, j+1, delay)
        showAround(i+1, j-1, delay)
        showAround(i+1, j, delay)
        showAround(i+1, j+1, delay)
    }
}