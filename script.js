const key = config.API_KEY; // remember to change daily since i dont have a prod key :(

let players = {"venncy": null}; // add other players here to have them show up on the leaderboard

const ranksEnum = Object.freeze({
    "IRON IV": 0, "IRON III": 1, "IRON II": 2, "IRON I": 3,
    "BRONZE IV": 4, "BRONZE III": 5, "BRONZE II": 6, "BRONZE I": 7,
    "SILVER IV": 8, "SILVER III": 9, "SILVER II": 10, "SILVER I": 11,
    "GOLD IV": 12, "GOLD III": 13, "GOLD II": 14, "GOLD I": 15,
    "PLATINUM IV": 16, "PLATINUM III": 17, "PLATINUM II": 18, "PLATINUM I": 19,
    "DIAMOND IV": 20, "DIAMOND III": 21, "DIAMOND II": 22, "DIAMOND I": 23,
    "MASTER": 24, "GRANDMASTER": 25, "CHALLENGER": 26
});

function update() {
    let tableBody = document.getElementById("leaderboardBody");
    while (tableBody.childNodes.length != 0) {
        tableBody.removeChild(tableBody.childNodes[0]);
    }
    let users = Object.keys(players);
    for (let i = 0; i < users.length; i++) {
        getPlayerInfo(users[i]);
    }
}

function getPlayerInfo(player) {
    fetch(`https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${player}?api_key=${key}`)
    .then(response => response.json())
    .then(data => {
        rankFromSummonerId(data["name"], data["id"]);
    }
    )
    .catch(error => alert(error))
}

function rankFromSummonerId(player, id) {
    fetch(`https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}?api_key=${key}`)
    .then(response => response.json())
    .then(data => {
        let info = data[0]; // for some reason the endpoint returns an array of the json?
        updateRank(player, `${info["tier"]} ${info["rank"]}`);
    })
    .catch(error => alert(error))
}

function updateRank(player, rank) {
    players[player] = rank;
    let newRow = document.createElement("tr");
    let newEntryPlayer = document.createElement("td");
    let playerNode = document.createTextNode(player);
    newEntryPlayer.appendChild(playerNode);
    let newEntryRank = document.createElement("td");
    let rankNode = document.createTextNode(rank);
    newEntryRank.appendChild(rankNode);

    newRow.appendChild(newEntryPlayer);
    newRow.appendChild(newEntryRank);

    const leaderboardBody = document.getElementById("leaderboardBody");
    leaderboardBody.appendChild(newRow);
}
