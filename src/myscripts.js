document.addEventListener("DOMContentLoaded", () => {
  const apiHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  //////////// API STUFF //////////////
  const GAMES_URL = "http://localhost:3000/games";
  const USERS_URL = "http://localhost:3000/users";

  const get = (url) => {
    return fetch(url).then((response) => response.json());
  };

  const post = (url, user) => {
    return fetch(url, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(user),
    }).then(response => response.json())
  };

  const patch = (url, user) => {
    return fetch(url + user.id, {
      method: "PATCH",
      headers: apiHeaders,
      body: JSON.stringify(user),
    }).then((response) => response.json());
  };

  const destroy = (url, user) => {
    return fetch(url + user.id, {
      method: "DELETE",
    });
  };

  const api = { get, post, patch, destroy };

  /////////// CONSTANTS //////////////
  const ulPlayers = document.querySelector("#list-players");
  const playerLeaderboard = document.querySelector("#leaderboard");
  let playerNumber = 1;
  const canvas = document.querySelector("canvas");
  const container = document.querySelector(".container-div");
  const ctx = canvas.getContext("2d");
  let painting = false;
  const addPlayerBtn = document.querySelector("#add-player");
  const addNewPlayer = document.querySelector("#new-player");

  /////////// FUNCTIONS ///////////////
  canvas.width = 1000;
  canvas.height = 500;
  canvas.top = 170;
  canvas.left = 430;

  const startPosition = (e) => {
    painting = true;
    paint(e);
  };

  const finishedPosition = () => {
    painting = false;
    ctx.beginPath();
  };

  const paint = (e) => {
    if (!painting) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "circle";
    ctx.color = "white";

    ///// HACKY WAY TO DRAW AT MOUSE POINT. NEED TO FIGURE OUT MOUSE CO_ORDINATES ON CLICK ////////
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
  };

  const getUsers = () => {
    api.get(GAMES_URL).then((games) => {
      const game = games.slice(-1)[0];
      game.users.forEach((user) => renderUser(user));
      passingGame(game);
    });
  };

  ////////// CALL FUNCTIONS ///////////
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", paint);
  canvas.addEventListener("mouseout", finishedPosition);

  const renderUser = (user) => {
    console.log(ulPlayers);
    const liPlayer = document.createElement("li");
    const currentPlayer = document.createElement("button");
    currentPlayer.innerHTML = `${user.name}`;

    liPlayer.appendChild(currentPlayer);
    ulPlayers.appendChild(liPlayer);

    const liPlayerScore = document.createElement("li");
    liPlayerScore.innerText = ` ${playerNumber}. ${user.name} => ${user.points}`;
    playerNumber += 1;

    playerLeaderboard.appendChild(liPlayerScore);
  };

  const passingGame = (game) => {
    addPlayerBtn.addEventListener("click", () => {
      createNewPlayer(game);
    });
  };

  const createNewPlayer = (game) => {
    const name = addNewPlayer.value;
    console.log(game.id);
    const user = {
      name: name,
      points: 0,
      game_id: game.id,
    };
    api.post(USERS_URL, user).then(renderUser(user))
  };

  getUsers();
});
