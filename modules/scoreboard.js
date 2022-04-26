const el = document.querySelector('#scoreboard')

const refreshScoreboard = (players) => {
  let html = `
    <table>
      <tbody>
        <tr>
          <th>Lp</th>
          <th>Gracz</th>
          <th>Punkty</th>
        </tr>`

  html += [...players].sort((a, b) => b.points - a.points)
    .map((player, i) => `
      <tr ${player.outOfMoves ? 'class="disabled"' : ''}>
        <td>${i + 1}</td>
        <td class="bold" style="color: ${player.color};">${player.name}</td>
        <td>${player.points}</td>
      </tr>
    `).join('')

  html += '</tbody></table>'

  el.innerHTML = html
}

export {
  refreshScoreboard
}