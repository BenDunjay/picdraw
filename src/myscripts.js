document.addEventListener("DOMContentLoaded", () => {
  const apiHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
    };


  //////////// API STUFF //////////////
  const GAMES_URL = "http://localhost:3000/games";
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
  let currentGo = 0
  let currentPlayer = ""

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
    
    const liPlayer = document.createElement("li");
    const currentPlayer = document.createElement("button");
    currentPlayer.classList.add('player')
    const removePlayer = document.createElement("button");
    removePlayer.innerHTML = '🚮'
    removePlayer.classList.add('remove-player')
    currentPlayer.innerHTML = `${user.name}`;

    // const liPlayerScore = document.createElement("tr");
    
    const tableRow = table.insertRow()
    const tableName = tableRow.insertCell(0)
    const tablePoints = tableRow.insertCell(1)
    tableName.innerHTML = `${user.name}`
    tablePoints.innerHTML = `${user.points}`
  
    // liPlayerScore.innerText = ` ${playerNumber}. ${user.name} => ${user.points}`;
    playerNumber += 1;

    currentPlayer.addEventListener('click', (e) => {
      addScore(user, e)
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
    const name = addNewPlayer.value;
    console.log(game.id);
    const user = {
      name: name,
      points: 0,
      game_id: game.id,
    };
    api.post(USERS_URL, user).then((newUser) => renderUser(newUser))
  };

///// TO BE MOVED AROUND
  const deletePlayer = ( user, li, userRow) => {
    api.destroy(USERS_URL, user).then(li.remove(), userRow.remove())
  }

  ///// RANDOM WORD EVENT LISTENER

let wordArray = [`Witch`, `American Flag`, `Penguin`, `Football Pitch`, `Horse`, `Computer`, `Tennis Racquet`, `Bob Marley`]

wordGenerator.addEventListener('click', () => {
    picWord.innerText = wordArray[Math.floor(Math.random() * wordArray.length)]
    timer.hidden = false
    timer.innerText = 3
    clearInterval(decreaseNew)
    decreaseNew = decreasingCounter()
})

const decrease = () => {
  num = parseInt(timer.innerText)
    if (num !== 0){
    num = num - 1
    timer.innerText = num
    }else{
    alert("Click on the person who got the answer right! Then when the next person is ready, click generate!")
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
    currentGo += 1
    if (currentGo >= game.users.length) {
      currentGo = 0
    }
  });

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
 getUsers()

 // tell them whos go it is next 
cyclePlayer()

  

    clearInterval(decreaseNew)
})
}


// call function 
  getUsers();

});
