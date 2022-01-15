const key = ""; // remember to change daily since i dont have a prod key :(

let players = {}; // add other players here to have them show up on the leaderboard

const ranksEnum = Object.freeze({
    "IRON IV": 0, "IRON III": 1, "IRON II": 2, "IRON I": 3,
    "BRONZE IV": 4, "BRONZE III": 5, "BRONZE II": 6, "BRONZE I": 7,
    "SILVER IV": 8, "SILVER III": 9, "SILVER II": 10, "SILVER I": 11,
    "GOLD IV": 12, "GOLD III": 13, "GOLD II": 14, "GOLD I": 15,
    "PLATINUM IV": 16, "PLATINUM III": 17, "PLATINUM II": 18, "PLATINUM I": 19,
    "DIAMOND IV": 20, "DIAMOND III": 21, "DIAMOND II": 22, "DIAMOND I": 23,
    "MASTER": 24, "GRANDMASTER": 25, "CHALLENGER": 26
});

function clickHandler() {
    changeButtonText();
    update();
    changeLastUpdated();
}

function update() {
    clearBoard();
    let users = Object.keys(players);
    users.forEach(user => getPlayerInfo(user));
    setTimeout(orderPlayers, 500); // the timeout is so the players object has time to finish updating; there's definitely a more elegant way to do this
}

function clearBoard() {
    // removes all current entries and fetches each player's information from the riot api
    let tableBody = document.getElementById("leaderboardBody");
    while (tableBody.childNodes.length != 0) {
        tableBody.removeChild(tableBody.childNodes[0]);
    }
}

function getPlayerInfo(player) {
    // fetching from riot api with summoner name
    fetch(`https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${player}?api_key=${key}`)
    .then(response => response.json())
    .then(data => {
        rankFromSummonerId(data["name"], data["id"]);
    }
    )
    .catch(error => alert(error))
}

function rankFromSummonerId(player, id) {
    // since riot api doesnt have tft rank from summoner name, we have to find it from the id
    fetch(`https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}?api_key=${key}`)
    .then(response => response.json())
    .then(data => {
        let info = data[0];
        players[player] = `${info["tier"]} ${info["rank"]}`;
    })
    .catch(error => console.log(error))
}

function orderPlayers() {
    const sortedArray = Object.entries(players).sort(([,a],[,b]) => ranksEnum[b] - ranksEnum[a]);
    displayUpdatedRankings(sortedArray);
}

function displayUpdatedRankings(sorted) {
    sorted.forEach(entry => {
        let playerUsername = entry[0];
        let playerRank = entry[1];
        let newRow = document.createElement("tr");
        let newEntryPlayer = document.createElement("td");
        let playerNode = document.createTextNode(playerUsername);
        newEntryPlayer.appendChild(playerNode);
        let newEntryRank = document.createElement("td");
        let rankNode = document.createTextNode(playerRank);
        newEntryRank.appendChild(rankNode);

        newRow.appendChild(newEntryPlayer);
        newRow.appendChild(newEntryRank);

        const leaderboardBody = document.getElementById("leaderboardBody");
        leaderboardBody.appendChild(newRow);
    });
}

function changeButtonText() {
    const btn = document.querySelector(".update");
    if (btn.innerText === "Load Players") {
        btn.innerText = "Update";
    }
}

function changeLastUpdated() {
    const lastUpdatedText = document.getElementById("lastUpdated");
    lastUpdatedText.innerText = `Last updated: ${Date()}`
}

function newPlayerHandler() {
    const newPlayer = document.querySelector("#newPlayer").value;
    if (newPlayer === "") {
        alert("Enter a summoner name!")
    } else if (newPlayer in players) {
        alert("This summoner is already in the leaderboard!");
    } else if (players.length === 10) {
        alert("The leaderboard is full!") // make a way to remove players
    } else {
        document.querySelector(".update").removeAttribute("hidden");
        document.querySelector("#table").removeAttribute("hidden");
        players[newPlayer] = null;
        // need a way to validate that summoner exists in na/has a tft rank
        clearBoard();
        getPlayerInfo(newPlayer);
        setTimeout(orderPlayers, 500); // the timeout is so the players object has time to finish updating; there's definitely a more elegant way to do this
        changeLastUpdated();
    }
}
