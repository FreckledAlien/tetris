document.addEventListener('DOMContentLoaded', function () {
  // const grid = document.querySelector('.grid')
  const width = 10
  const height = 20
  const gridSize = width * height

  const grid = createGrid()
  let squares = Array.from(grid.querySelectorAll('div'))
  const startBtn = document.querySelector('.button')
  const hamburgerBtn = document.querySelector('.toggler')
  const menu = document.querySelector('.menu')
  const span = document.getElementsByClassName('close')[0]
  const scoreDisplay = document.getElementById('score-display')
  const linesDisplay = document.getElementById('line-display')
  let currentIndex = 0
  let currentRotation = 0
  let score = 0
  let lines = 0
  let timerId
  let nextRandom = 0
  const colors = [
    'url(images/blue_block.png)',
    'url(images/pink_block.png)',
    'url(images/purple_block.png)',
    'url(images/peach_block.png)',
    'url(images/yellow_block.png)'
  ]

  function createGrid () {
    // The main grid
    let grid = document.querySelector('.grid')
    for (var i = 0; i < gridSize; i++) {
      let gridElement = document.createElement('div')
      grid.appendChild(gridElement)
    }
    // Set base
    for (var j = 0; j < width; j++) {
      let gridElement = document.createElement('div')
      gridElement.setAttribute('class', 'block3')
      grid.appendChild(gridElement)
    }
    let previousGrid = document.querySelector('.previous-grid')
    for (var k = 0; k < 16; k++) {
      let gridElement = document.createElement('div')
      previousGrid.appendChild(gridElement)
    }
    return grid
  }

  // The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  // Randomly select Tetromino
  let randomTetromino = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[randomTetromino][currentRotation]

  let currentPosition = 4
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('block')
      squares[currentPosition + index].style.backgroundImage = colors[randomTetromino]
    })
  }

  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
      current.forEach(index => squares[index + currentPosition].classList.add('block2'))
      current = theTetrominoes[randomTetromino][currentRotation]
      randomTetromino = nextRandom
      current = theTetrominoes[randomTetromino][currentRotation]
      currentPosition = 4
      draw()
      // displayShape()
      addScore()
      gameOver()
    }
  }
  // freeze()

  function unDraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('block')
      squares[currentPosition + index].style.backgroundImage = 'none'
    })
  }
  function rotate () {
    unDraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[randomTetromino][currentRotation]
    draw()
  }

  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

  function moveDown () {
    unDraw()
    currentPosition = currentPosition += width
    draw()
    freeze()
  }

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    }
  })

  function moveLeft () {
    unDraw()
    const leftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!leftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition += 1
    }
    draw()
  }

  function moveRight () {
    unDraw()
    const rightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!rightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition -= 1
    }
    draw()
  }

  // Styling eventListeners
  hamburgerBtn.addEventListener('click', () => {
    menu.style.display = 'flex'
  })
  span.addEventListener('click', () => {
    menu.style.display = 'none'
  })

  function checkKey (e) {
    // console.log(e.keyCode)
    //  UP
    if (e.keyCode === 38) {
      rotate()
    }
    // RIGHT
    if (e.keyCode === 39) {
      moveRight()
    }
    // DOWN
    if (e.keyCode === 40) {
      moveDown()
    }
    // LEFT
    if (e.keyCode === 37) {
      moveLeft()
      if (currentPosition === -1) {
        // sideDraw()
      }
      // console.log(currentPosition)
    }
  }

  document.onkeydown = checkKey

  function addScore () {
    for (currentIndex = 0; currentIndex < gridSize; currentIndex += width) {
      const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
      if (row.every(index => squares[index].classList.contains('block2'))) {
        score += 10
        lines += 1
        scoreDisplay.innerHTML = score
        linesDisplay.innerHTML = lines
        row.forEach(index => {
          squares[index].style.backgroundImage = 'none'
          squares[index].classList.remove('block2') || squares[index].classList.remove('block')
        })
        const squaresRemoved = squares.splice(currentIndex, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }
})
