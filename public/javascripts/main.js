const table = document.querySelector('#leaderboardTable');
const playerBio = document.querySelector('#player-bio');
const playerSearchInput = document.querySelector('#playerSearchInput');
const playerSearchSubmit = document.querySelector('#playerSearchSubmit');
const favoritePlayer = document.querySelector('#favorite-player');


function getLeaderboardData () {
  axios.get('https://statdata.pgatour.com/r/014/leaderboard-v2mini.json')
  .then(function(res) {
    const playerData = res.data.leaderboard.players.map(player => {
      return `
        <div class="row">
          <div class="cell" data-title="position" id="position">
          ${player.current_position}
          </div>
          <div class="cell" data-title="name" id="name">
          ${player.player_bio.last_name}
          </div> 
          <div class="cell" data-title="currentRoundScore" id="currentRoundScore">
            ${player.today && player.today < 0 ? `${player.today}` : (player.today > 0 ? `+${player.today}` : (player.today === 0 ? 'E' : (player.rounds[player.rounds.length-1].tee_time ? `${player.rounds[player.rounds.length-1].tee_time}` : 'Missed Cut')))}
          </div>
          <div class="cell" data-title="thru" id="thru">
            ${player.thru ? `${player.thru}` : '-'}
          </div>
          <div class="cell" data-title="totalScore" id="totalScore">
            ${player.total === 0 ? 'E' : (player.total > 0 ? `+${player.total}` : `${player.total}`)}
          </div>
        </div>
      `;  
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
getLeaderboardData();

setInterval(function(){  
  getLeaderboardData();
}, 600000);

function winnerTrophy() {

}

function getTopPlayers() {
  axios.get('https://statdata.pgatour.com/r/014/leaderboard-v2mini.json')
  .then(function(res) {
    const topPlayerData = res.data.leaderboard.players.slice(0,10).map(player => {
      return `
        <div class="player-info">
          <div class="player-photo">
            <img src="images/players/${player.player_bio.first_name}_${player.player_bio.last_name}.png" />
          </div>
          <div class="player-info-text">
            <h2>
              ${player.player_bio.first_name} ${player.player_bio.last_name}
              <span>${player.current_position === `1` ? `<i class="fas fa-trophy"></i> 2018 Masters Champion` : ``}</span>
            </h2>
            <p class="country"><img src="images/flags/${player.player_bio.country}.png" /> <span>${player.player_bio.country}</span></p>
            <div class="player-info-table">
              <div class="row header">
                <div class="cell">
                  Round 1
                </div>
                <div class="cell">
                  Round 2
                </div>
                <div class="cell">
                  Round 3
                </div>
                <div class="cell">
                  Round 4
                </div>
              </div>
              <div class="row">
                <div class="cell data">
                  ${player.rounds[0].strokes}
                </div>
                <div class="cell data">
                  ${player.rounds[1].strokes}
                </div>
                <div class="cell data">
                  ${player.rounds[2].strokes}
                </div>
                <div class="cell data">
                  ${player.rounds[3].strokes}
                </div>
              </div>
            </div>
            <p class="player-info-total"><span>Total Score: </span>${player.total < 0 ? `${player.total}` : (player.total === 0 ? `E` : `+${player.total}`) }</p>
          </div> 
        </div>
      `   
    }).join('');
    playerBio.innerHTML = topPlayerData;
    
  })
  .catch(function(error) {
    console.log(error);
  })
}
getTopPlayers();

const playerInfoButton = document.querySelector('#playerInfoButton');
playerInfoButton.addEventListener('click', function() {
  playerBio.classList.toggle("display-none");
  favoritePlayer.classList.add("display-none");
});

function getFavoritePlayer() {
  playerSearchSubmit.addEventListener('click', function(e) {
    e.preventDefault();
    playerBio.classList.add("display-none");
    favoritePlayer.classList.remove("display-none");
    const playerSearchValue = playerSearchInput.value;
    axios.get('https://statdata.pgatour.com/r/014/leaderboard-v2mini.json')
      .then(function(res) {
        const playerData = res.data.leaderboard.players.filter(function(player) {
          const playerFullName = `${player.player_bio.first_name} ${player.player_bio.last_name}`;
          return playerFullName.toLowerCase() === playerSearchValue.toLowerCase(); 
        });
        const player = playerData[0];
        if (!player) {
          favoritePlayer.innerHTML = `<p>Don't recognize that one, try again</p>`;
          return; // if there is no matching player stop the funciton
        }
        const playerHTML = `
        <div class="player-info">
          <div class="player-photo">
            <img src="images/players/${player.player_bio.first_name}_${player.player_bio.last_name}.png" />
          </div>
          <div class="player-info-text">
            <h2>
              ${player.player_bio.first_name} ${player.player_bio.last_name}
              <span>${player.current_position === `1` ? `<i class="fas fa-trophy"></i> 2018 Masters Champion` : ``}</span>
            </h2>
            <p class="country"><img src="images/flags/${player.player_bio.country}.png" /> <span>${player.player_bio.country}</span></p>
            <div class="player-info-table">
              <div class="row header">
                <div class="cell">
                  Round 1
                </div>
                <div class="cell">
                  Round 2
                </div>
                <div class="cell">
                  Round 3
                </div>
                <div class="cell">
                  Round 4
                </div>
              </div>
              <div class="row">
                <div class="cell data">
                  ${player.rounds[0].strokes}
                </div>
                <div class="cell data">
                  ${player.rounds[1].strokes}
                </div>
                <div class="cell data">
                  ${player.rounds[2].strokes}
                </div>
                <div class="cell data">
                  ${player.rounds[3].strokes}
                </div>
              </div>
            </div>
            <p class="player-info-total"><span>Total Score: </span>${player.total < 0 ? `${player.total}` : (player.total === 0 ? `E` : `+${player.total}`) }</p>
          </div> 
        </div>
      `   
      favoritePlayer.innerHTML = playerHTML; 
      })
      .catch(function(error) {
        console.log(error);
      })
  })
}
getFavoritePlayer();








