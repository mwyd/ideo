import { getRandomInRange } from './helpers'
import { diceAnimationInterval, ideoApiKey } from '../config'

const el = document.querySelector('#dice')

let intervalId = null
let lastDiceValue = 1

const setDiceValue = (value) => {
  el.src = `/img/d${value}.svg`
}

const startDiceAnimation = () => {
  intervalId = setInterval(animateDice, diceAnimationInterval)
}

const stopDiceAnimation = () => {
  clearInterval(intervalId)
}

const rollDice = async () => {
  let roll = getRandomInRange(1, 6)

  try {
    const response = await fetch('https://api3.v.test.ideo.pl/cube', {
      headers: {
        'x-api-key': ideoApiKey
      }
    })

    const { number } = await response.json()

    roll = number
  } catch(err) {
    console.log(err) // ¯\_(ツ)_/¯
  }

  return roll
}

const animateDice = () => {
  const nextValue = lastDiceValue + 1
  lastDiceValue = nextValue > 6 ? 1 : nextValue

  setDiceValue(lastDiceValue)
}

export {
  setDiceValue,
  startDiceAnimation,
  stopDiceAnimation,
  rollDice
}