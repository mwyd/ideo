import { playersCountLimit } from '../config'
import { getRandomInRange } from './helpers'
import { refreshScoreboard } from './scoreboard'

const players = []

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

const getActivePlayersCount = () => {
  return players.filter(player => !player.outOfMoves).length
}

const initPlayers = () => {
  const url = new URLSearchParams(location.search)

  const [min, max] = playersCountLimit

  let playersCount = parseInt(url.get('players'))

  if(isNaN(playersCount) || playersCount < min || playersCount > max) {
    playersCount = min

    url.set('players', min)

    const nextUrl = location.origin + '?' + url.toString()

    window.history.pushState({ path: nextUrl }, '', nextUrl)
  }

  for(let i = 0; i < playersCount; i++) {
    const r = getRandomInRange(0, 255)
    const b = getRandomInRange(0, 255)
    const g = getRandomInRange(0, 255)

    players.push(createPlayer(`Gracz ${i + 1}`, `rgb(${r}, ${g}, ${b})`))
  }
}

initPlayers()

export {
  players,
  getActivePlayersCount
}