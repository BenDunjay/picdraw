document.addEventListener("DOMContentLoaded", () => {
  const apiHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
    };


  //////////// API STUFF //////////////
  const GAMES_URL = "http://localhost:3000/games/";
  const USERS_URL = "http://localhost:3000/users/";

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
      body: JSON.stringify(user)
    }).then(response => response.json());
  };

  const destroy = (url, user) => {
    return fetch(url + user.id, {
      method: "DELETE"
    }).then(response => response.json())
  }

  const api = { get, post, patch, destroy };

  /////////// CONSTANTS //////////////
  const ulPlayers = document.querySelector("#list-players");
  let playerNumber = 1;
  const canvas = document.querySelector("canvas");
  const table = document.querySelector('table');
  const ctx = canvas.getContext("2d");
  let painting = false;
  const addPlayerBtn = document.querySelector("#add-player");
  const addNewPlayer = document.querySelector("#new-player");
  const picWord = document.querySelector('#word')
  const wordGenerator = document.querySelector('#generate')
  const timer = document.querySelector('#timer')
  timer.hidden = true 
  let currentGo = 1
  let currentPlayer = ""
  const newBtn = document.querySelector('#new-game')
  const red = document.querySelector('#red')
  const blue = document.querySelector('#blue')
  const yellow = document.querySelector('#yellow')
  const eraser = document.querySelector('#eraser')

  /////////// FUNCTIONS ///////////////
  canvas.width = 1000;
  canvas.height = 650;
  canvas.top = 120;
  canvas.left = 410;

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

    ///// HACKY WAY TO DRAW AT MOUSE POINT. NEED TO FIGURE OUT MOUSE CO_ORDINATES ON CLICK ////////
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
  };

  const getPlayers = () => {
    api.get(GAMES_URL).then((games) => {
      let game = games.slice(-1)[0];
      game.users.forEach((user) => renderUser(user));
      passingGame(game);
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 5;
    });
  };

  ////////// CALL FUNCTIONS ///////////
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", paint);
  canvas.addEventListener("mouseout", finishedPosition);

  const renderUser = (user) => {
    
    const liPlayer = document.createElement("li");
    liPlayer.classList.add('player-li')
    const currentPlayer = document.createElement("button");
    currentPlayer.classList.add('player')
    const removePlayer = document.createElement("button");
    removePlayer.innerHTML = 'X'
    removePlayer.classList.add('remove-player')
    currentPlayer.disabled = true
    currentPlayer.innerHTML = `${user.name}`;

    // const liPlayerScore = document.createElement("tr");
    
    const tableRow = table.insertRow()
    tableRow.classList.add('row')
    const tableName = tableRow.insertCell(0)
    const tablePoints = tableRow.insertCell(1)
    tableName.innerHTML = `${user.name}`
    tablePoints.innerHTML = `${user.points}`
  
    // liPlayerScore.innerText = ` ${playerNumber}. ${user.name} => ${user.points}`;
    playerNumber += 1;

    currentPlayer.addEventListener('click', (e) => {
      addScore(user, e)
      ctx.clearRect(0, 0, canvas.width, canvas.height) 
      // timer.innerHTML = 0
    })

    liPlayer.append(currentPlayer, removePlayer);
    ulPlayers.appendChild(liPlayer);
    // playerLeaderboard.appendChild(liPlayerScore);

    removePlayer.addEventListener('click',() => {
      // console.log(user)
      deletePlayer(user, liPlayer, tableRow)
    })
  };

  const passingGame = (game) => {
    addPlayerBtn.addEventListener("click", () => {
      createNewPlayer(game);
    });
  };

  const createNewPlayer = (game) => {
      // api.get(GAMES_URL).then((games) => {
      // const game = games.slice(-1)[0];

      const name = addNewPlayer.value;
      const user = {
      name: name,
      points: 0,
      game_id: game.id,
    };
    api.post(USERS_URL, user).then((newUser) => renderUser(newUser))
    addNewPlayer.value = "" 
  // });
  };

///// TO BE MOVED AROUND
  const deletePlayer = ( user, li, userRow) => {
    api.destroy(USERS_URL, user).then(li.remove(), userRow.remove())
  }

  ///// RANDOM WORD EVENT LISTENER

let wordArray = [`Witch`, `American Flag`, `Penguin`, `Football Pitch`, `Horse`, `Computer`, `Tennis Racquet`, `Bob Marley`, `Iron`, `Trump`, `Hot Air Balloon`, `Fishing Trip`, `Hurdles`]

wordGenerator.addEventListener('click', () => {
    wordGenerator.innerText = `Generate Word`
    document.querySelectorAll('.player').forEach((button) => button.disabled = false )
    document.querySelector('#add-player').disabled = true
    picWord.innerText = wordArray[Math.floor(Math.random() * wordArray.length)]
    timer.hidden = false
    timer.innerText = 30
    clearInterval(decreaseNew)
    decreaseNew = decreasingCounter()
})

const decrease = () => {
  num = parseInt(timer.innerText)
    if (num !== 0){
    num = num - 1
    timer.innerText = num
    }else{
    timer.hidden = true
    clearInterval(decreaseNew)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cyclePlayer()
  }
}

const cyclePlayer = () => {
  api.get(GAMES_URL).then((games) => {
    const game = games.slice(-1)[0];
   currentPlayer = game.users[currentGo].name
    console.log(currentPlayer)
    displayPlayer()
    currentGo += 1
    if (currentGo >= game.users.length) {
      currentGo = 0
    }
  });
}

const displayPlayer = () => {
const playerName = document.querySelector('.display-name')
console.log(timer.innerHTML)
if (parseInt(timer.innerHTML) > 0){
  playerName.innerHTML = `Great guess! ${currentPlayer} it's your go! Click Generate to get a word!`
  setTimeout(function(){ modal.style.display = "block"; }, 1000);}
  else {
    playerName.innerHTML = `You ran out of time! ${currentPlayer} it's your go! Click Generate to get a word!`
    setTimeout(function(){ modal.style.display = "block"; }, 1000)
  }
}

// clears the interval and resets it. Need to call this function every time it would be clicked on. 

function decreasingCounter() {
  return setInterval(decrease, 1000)
}
let decreaseNew = decreasingCounter()


const addScore = (user, event) => {
  // add points to person who got it right
  user.points += parseInt(timer.innerText)
  // patch points   
  api.patch(USERS_URL, user).then( () => {
    ulPlayers.innerHTML = "";
    let tableRows = document.querySelectorAll('td')
 tableRows.forEach(row => row.parentElement.remove())
    
 //re-render users with correct points.
 getPlayers()

 // tell them whos go it is next 
cyclePlayer()

  

    clearInterval(decreaseNew)
})
}

newBtn.addEventListener('click', () => { 
    const newGame = { name: "",
                      users: []
}
    api.post(GAMES_URL, newGame).then(()=> {
      // ulPlayers.innerHTML = "";
      // let innerTable = document.querySelectorAll('.row')
      // console.log(innerTable)
      // innerTable.forEach(row => row.remove())
      // document.querySelector('#add-player').disabled = false
      location.reload();
    })
})

// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

blue.addEventListener('click', () => {
  ctx.strokeStyle = 'blue'
  ctx.lineWidth = 5
})
red.addEventListener('click', () => {
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 5
})
yellow.addEventListener('click', () => {
  ctx.strokeStyle = 'yellow'
  ctx.lineWidth = 5
})
eraser.addEventListener('click', () => {
  ctx.strokeStyle = 'rgb(123, 57, 255)';
  ctx.lineWidth = 100
})

// call function 
  getPlayers();
  
});
