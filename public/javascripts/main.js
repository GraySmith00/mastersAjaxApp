const table = document.querySelector('#table');

function getMastersData () {
  axios.get('https://statdata.pgatour.com/r/014/leaderboard-v2mini.json')
  .then(function(res) {
     const playerData = res.data.leaderboard.players.map(player => {
      const playerPositionAndName = 
      `
        <div class="row">
          <div class="cell" data-title="position" id="position">
          ${player.current_position}
          </div>
          <div class="cell" data-title="name" id="name">
          ${player.player_bio.last_name}
          </div> 
      `;   
      
      if (player.today) {
        var playerToday =
        `
          <div class="cell" data-title="currentRoundScore"      id="currentRoundScore">
            ${player.today}
          </div>
        `;
      } else if (player.today === 0) {
        var playerToday = 
        `
          <div class="cell" data-title="currentRoundScore"      id="currentRoundScore">
            E
          </div>
        `;          
      } else {
        `
          <div class="cell" data-title="currentRoundScore"      id="currentRoundScore">
            ${player.rounds[player.rounds.length-1].tee_time}
          </div>
        `;  
      }
      

      if (player.thru) {
        var playerThru = 
        `  
            <div class="cell" data-title="thru" id="thru">
            ${player.thru}
            </div>
        `
      } else {
        var playerThru =
        `  
            <div class="cell" data-title="thru" id="thru">
            -
            </div>
        `
      }
      
      const playerTotal =
      `
          <div class="cell" data-title="totalScore" id="totalScore">
          ${player.total} 
          </div>
        </div>
      `;
      

      return playerPositionAndName + playerToday + playerThru + playerTotal;
     }).join('');

    table.innerHTML = 
    `<div class="row header">
      <div class="cell">
        Pos
      </div>
      <div class="cell">
        Player
      </div>
      <div class="cell">
        Round ${res.data.leaderboard.current_round}
      </div>
      <div class="cell">
        Thru
      </div>
      <div class="cell">
        Total
      </div>
    </div>
    ${playerData}`;
  })
  .catch(function(error) {
    console.log(error);
  })
}  

getMastersData();
setInterval(function(){  
  getMastersData();
}, 60000);

