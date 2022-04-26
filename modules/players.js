import { refreshScoreboard } from './scoreboard'

const createPlayer = (name, color) => {
  const handler = {
    set(obj, prop, value) {
      obj[prop] = value

      if(['outOfMoves', 'points'].includes(prop)) {
        refreshScoreboard(players)
      }

      return true
    }
  }

  return new Proxy({ name, color, points: 0, outOfMoves: false }, handler)
}

const players = [
  createPlayer('Gracz 1', 'lightblue'),
  createPlayer('Gracz 2', 'lightcoral'),
  createPlayer('Gracz 3', 'lightgreen'),
  //createPlayer('Gracz 3', 'lightgrey')
]

const getActivePlayersCount = () => {
  return players.filter(player => !player.outOfMoves).length
}

export {
  players,
  getActivePlayersCount
}