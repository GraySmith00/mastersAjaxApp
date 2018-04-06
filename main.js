const position = document.querySelector('#position');
const name = document.querySelector('#name');
const currentRoundScore = document.querySelector('#currentRoundScore');
const thru = document.querySelector('#thru');
const totalScore = document.querySelector('#totalScore');

console.log('hey there');

axios.get('https://statdata.pgatour.com/r/014/leaderboard-v2mini.json')
  .then(function(res) {
    const playerInfo = res.data.leaderboard.players[0];
    const playerBio = res.data.leaderboard.players[0].player_bio;


    name.innerText = `${playerBio.short_name}. ${playerBio.last_name}`;
    position.innerText = playerInfo.current_position;
    currentRoundScore.innerText = playerInfo.today;
    thru.innerText = playerInfo.thru;
    totalScore.innerText = playerInfo.total;



  })
  .catch(function(error) {
    console.log(error);
  })