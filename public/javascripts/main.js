const table = document.querySelector('#leaderboardTable');
const playerBio = document.querySelector('#player-bio');
const playerSearchInput = document.querySelector('#playerSearchInput');
const playerSearchSubmit = document.querySelector('#playerSearchSubmit');
const favoritePlayer = document.querySelector('#favorite-player');


function getLeaderboardData () {
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
      
      if (player.total === 0) {
        var playerTotal =
        `
            <div class="cell" data-title="totalScore" id="totalScore">
            E
            </div>
          </div>
        `;  
      } else {
        var playerTotal =
        `
            <div class="cell" data-title="totalScore" id="totalScore">
            ${player.total} 
            </div>
          </div>
        `;
      }
      
      

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
getLeaderboardData();

setInterval(function(){  
  getLeaderboardData();
}, 600000);

function getTopPlayers() {
  axios.get('https://statdata.pgatour.com/r/014/leaderboard-v2mini.json')
  .then(function(res) {
    const topPlayerData = res.data.leaderboard.players.slice(0,10).map(player => {
      const htmlOne = `
        <div class="player-info">
          <div class="player-photo">
            <img src="images/players/${player.player_bio.first_name}_${player.player_bio.last_name}.png" />
          </div>
          <div class="player-info-text">
            <h2>
              ${player.player_bio.first_name} ${player.player_bio.last_name}
      `;
      if (player.current_position === "1") {
        var htmlTwo = `
                          <span> <i class="fas fa-trophy"></i> 2018 Masters Champion</span>
                        `;
      } else {
        var htmlTwo = ``;
      }

      const htmlThree =
      `
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
            <p class="player-info-total"><span>Total Score: </span>${player.total}</p>
          </div> 
        </div>`
      return (htmlOne + htmlTwo + htmlThree);
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
        const htmlOne = `
          <div class="player-info">
            <div class="player-photo">
              <img src="images/players/${player.player_bio.first_name}_${player.player_bio.last_name}.png" />
            </div>
            <div class="player-info-text">
              <h2>
                ${player.player_bio.first_name} ${player.player_bio.last_name}
        `;
        if (player.current_position === "1") {
          var htmlTwo = `
                            <span> <i class="fas fa-trophy"></i> 2018 Masters Champion</span>
                          `;
        } else {
          var htmlTwo = ``;
        }
  
        const htmlThree =
        `
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
              <p class="player-info-total"><span>Total Score: </span>${player.total}</p>
            </div> 
          </div>
        `;
        favoritePlayer.innerHTML = htmlOne + htmlTwo + htmlThree; 
      });
  })
}
getFavoritePlayer();








