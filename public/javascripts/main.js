const leaderboardTable = document.querySelector("#leaderboardTable");
const playerBio = document.querySelector("#player-bio");
const playerSearchInput = document.querySelector("#playerSearchInput");
const suggestions = document.querySelector(".suggestions");
const topPlayerButton = document.querySelector("#topPlayerButton");
const playerSearchSubmit = document.querySelector("#playerSearchSubmit");
const searchPlayerAlert = document.querySelector("#search-player-alert");
const favoritePlayer = document.querySelector("#favorite-player");

function leaderboardHTML(player) {
  return `
  <div class="row">
    <div class="cell" data-title="position" id="position">
    ${player.current_position}
    </div>
    <div class="cell" data-title="name" id="name">
    ${player.player_bio.short_name} ${player.player_bio.last_name}
    </div> 
    <div class="cell" data-title="currentRoundScore" id="currentRoundScore">
      ${
        player.today && player.today < 0
          ? `${player.today}`
          : player.today > 0
            ? `+${player.today}`
            : player.today === 0
              ? "E"
              : player.rounds[player.rounds.length - 1].tee_time
                ? `${player.rounds[player.rounds.length - 1].tee_time}`
                : "Missed Cut"
      }
    </div>
    <div class="cell" data-title="thru" id="thru">
      ${player.thru ? `${player.thru}` : "-"}
    </div>
    <div class="cell" data-title="totalScore" id="totalScore">
      ${
        player.total === 0
          ? "E"
          : player.total > 0
            ? `+${player.total}`
            : `${player.total}`
      }
    </div>
  </div>
  `;
}

function getLeaderboardData() {
  axios
    .get("https://statdata.pgatour.com/r/014/leaderboard-v2mini.json")
    .then(function(res) {
      const playerData = res.data.leaderboard.players
        .map(player => {
          return leaderboardHTML(player);
        })
        .join("");

      leaderboardTable.innerHTML = `
      <div class="row header">
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
      ${playerData}
    `;
    })
    .catch(function(error) {
      console.log(error);
    });
}
getLeaderboardData();

setInterval(function() {
  getLeaderboardData();
}, 6000000);

function playerHTML(player) {
  return `
  <div class="player-info">
    <div class="player-photo">
      <img src="images/players/${player.player_bio.first_name}_${
    player.player_bio.last_name
  }.png" />
    </div>
    <div class="player-info-text">
      <h2>
        ${player.player_bio.first_name} ${player.player_bio.last_name}
        <span>${
          player.current_position === `1`
            ? `<i class="fas fa-trophy"></i> 2018 Masters Champion`
            : ``
        }</span>
      </h2>
      <p class="country"><img src="images/flags/${
        player.player_bio.country
      }.png" /> <span>${player.player_bio.country}</span></p>
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
      <p class="player-info-total"><span>Total Score: </span>${
        player.total < 0
          ? `${player.total}`
          : player.total === 0
            ? `E`
            : `+${player.total}`
      }</p>
    </div> 
  </div>
  `;
}

function getTopPlayers() {
  axios
    .get("https://statdata.pgatour.com/r/014/leaderboard-v2mini.json")
    .then(function(res) {
      const topPlayerData = res.data.leaderboard.players
        .slice(0, 10)
        .map(player => {
          return playerHTML(player);
        })
        .join("");
      playerBio.innerHTML = topPlayerData;
    })
    .catch(function(error) {
      console.log(error);
    });
}
getTopPlayers();

topPlayerButton.addEventListener("click", function() {
  searchPlayerAlert.innerHTML = ``;
  playerBio.classList.toggle("display-none");
  favoritePlayer.classList.add("display-none");
});

const players = [];

axios
  .get("https://statdata.pgatour.com/r/014/leaderboard-v2mini.json")
  .then(function(res) {
    res.data.leaderboard.players.map(player => {
      players.push(
        `${player.player_bio.first_name} ${player.player_bio.last_name}`
      );
    });
  });

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      // e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}

autocomplete(playerSearchInput, players);

function getFavoritePlayer() {
  playerSearchSubmit.addEventListener("click", function(e) {
    e.preventDefault();
    playerBio.classList.add("display-none");
    favoritePlayer.classList.remove("display-none");
    const playerSearchValue = playerSearchInput.value;
    axios
      .get("https://statdata.pgatour.com/r/014/leaderboard-v2mini.json")
      .then(function(res) {
        const player = res.data.leaderboard.players.find(function(player) {
          const playerFullName = `${player.player_bio.first_name} ${
            player.player_bio.last_name
          }`;
          return (
            playerFullName.toLowerCase() === playerSearchValue.toLowerCase()
          );
        });
        if (!player) {
          searchPlayerAlert.innerHTML = `<p>Ooooops! Don't recognize that player, try again!<p>`;
          favoritePlayer.classList.add("display-none");
          return; // if there is no matching player stop the funciton
        }
        searchPlayerAlert.innerHTML = ``;
        favoritePlayer.innerHTML = playerHTML(player);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}
getFavoritePlayer();
