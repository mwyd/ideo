import { players, getActivePlayersCount } from './modules/players'
import { createField, drawBoard, getNeighbourIds } from './modules/board'
import { getRandomInRange, sleep } from './modules/helpers'
import { startDiceAnimation, stopDiceAnimation, rollDice, setDiceValue } from './modules/dice'
import { refreshScoreboard } from './modules/scoreboard'
import { finishAnimationDelay, minimalDiceAnimationDuration } from './config'
import gameStateEnum from './modules/gameStateEnum'

const rollBtn = document.querySelector('#roll-btn')
const turnInfo = document.querySelector('#turn')

const size = Math.pow(players.length, 3)
const virtual = []

let turn = getRandomInRange(0, players.length - 1)
let movesLeft = 0
let gameState = gameStateEnum.BEFORE_ROLL

const initVirtual = () => {
  for(let i = 0; i < size; i++) {
    const row = []

    for(let j = 0; j < size; j++) {
      const id = [i, j]

      const field = createField(id, handleClick, onTake)
      row.push(field)
    }

    virtual.push(row)
  }
}

const isNeighbourField = (i, j) => {
  const ids = getNeighbourIds(i, j, size)

  for(const [i, j] of ids) {
    if(virtual[i][j].belongsTo == turn) return true
  }

  return false
}

const hasAvailableFields = (playerId) => {
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      if(virtual[i][j].belongsTo != playerId) continue

      const ids = getNeighbourIds(i, j, size)

      if(ids.some(([x, y]) => virtual[x][y].belongsTo == null)) return true
    }
  }

  return false
}

const takeField = (field) => {
  players[turn].points++

  movesLeft--

  field.el.style.backgroundColor = players[turn].color
  field.el.classList.add('board__field--disabled')
  field.el.onclick = null

  field.belongsTo = turn
}

const handleClick = (i, j) => {
  if(gameState != gameStateEnum.AFTER_ROLL) return

  if(players[turn].points == 0 || isNeighbourField(i, j)) {
    takeField(virtual[i][j])
  }
}

const onTake = () => {
  for(let i = 0; i < players.length; i++) {
    const player = players[i]

    if(player.outOfMoves) continue

    if(player.points > 0 && !hasAvailableFields(i)) {
      player.outOfMoves = true

      if(i == turn) movesLeft = 0
    }
  }

  if(movesLeft == 0) changeTurn()

  const activePlayersCount = getActivePlayersCount()
  
  if(activePlayersCount == 1) {
    gameState = gameStateEnum.FINISHED
    rollBtn.setAttribute('disabled', true)

    playWinnerAnimation()
  }
}

const playWinnerAnimation = async () => {
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      const field = virtual[i][j]

      if(field.belongsTo != null) continue

      takeField({ ...field })
    }

    await sleep(finishAnimationDelay)
  }

  alert(`${players[turn].name} wygrywa z wynikiem ${players[turn].points}`)
}

const changeTurn = () => {
  turn = [...players, ...players].findIndex((player, i) => i > turn && !player.outOfMoves) % players.length

  gameState = gameStateEnum.BEFORE_ROLL

  turnInfo.innerHTML = `Tura: <span class="bold" style="color: ${players[turn].color};">${players[turn].name}</span>`
}

const roll = async () => {
  if(gameState != gameStateEnum.BEFORE_ROLL) return

  rollBtn.setAttribute('disabled', true)

  gameState = gameStateEnum.ROLLING
  
  startDiceAnimation()

  const [moves] = await Promise.all([
    rollDice(),
    sleep(minimalDiceAnimationDuration)
  ])
  
  movesLeft = moves

  stopDiceAnimation()
  setDiceValue(movesLeft)

  gameState = gameStateEnum.AFTER_ROLL

  rollBtn.removeAttribute('disabled')
}

rollBtn.addEventListener('click', roll)

initVirtual()
drawBoard(virtual)
refreshScoreboard(players)
changeTurn()