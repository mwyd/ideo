const el = document.querySelector('#board')

const neighbourFieldScope = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1]
]

const createField = (id, handleClick, onTake) => {
  const el = document.createElement('td')
  el.classList.add('board__field')

  el.onclick = () => handleClick(...id)

  const handler = {
    set(obj, prop, value) {
      obj[prop] = value

      if(prop == 'belongsTo') {
        onTake()
      }

      return true
    }
  }

  return new Proxy({ id, el, belongsTo: null }, handler)
}

const drawBoard = (virtual) => {
  for(let i = 0; i < virtual.length; i++) {
    const tr = document.createElement('tr')

    for(let j = 0; j < virtual[i].length; j++) {
      tr.appendChild(virtual[i][j].el)
    }

    el.appendChild(tr)
  }
}

const getNeighbourIds = (i, j, size) => {
  const ids = []

  for(const [x, y] of neighbourFieldScope) {
    const nextX = i + x
    const nextY = j + y

    if(nextX < 0 || nextY < 0 || nextX == size || nextY == size) continue

    ids.push([nextX, nextY])
  }

  return ids
}

export {
  createField,
  drawBoard,
  getNeighbourIds
}