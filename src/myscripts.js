document.addEventListener("DOMContentLoaded", () => {
  const apiHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  //////////// API STUFF //////////////
  const get = (url) => {
    return fetch(url).then((response) => response.JSON());
  };

  const post = (url, game) => {
    return fetch(url + game.id, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(game),
    }).then((response) => response.JSON());
  };

  const patch = (url, user) => {
    return fetch(url + user.id, {
      method: "PATCH",
      headers: apiHeaders,
      body: JSON.stringify(user),
    }).then((response) => response.JSON());
  };

  const destroy = (url, user) => {
    return fetch(url + user.id, {
      method: "DELETE",
    });
  };

  const api = { get, post, patch, destroy };

  /////////// CONSTANTS ///////////////
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  let painting = false;

  /////////// FUNCTIONS ///////////////
canvas.width = 1000
canvas.height = 500 
canvas.top = 170 
canvas.left = 430

  const startPosition = (e) => {
    painting = true;
    paint(e)
  };

  const finishedPosition = () => {
    painting = false;
    ctx.beginPath()
  };

  const paint = (e) => {
    if (!painting) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'circle';
    ctx.color = 'white'

      ///// HACKY WAY TO DRAW AT MOUSE POINT. NEED TO FIGURE OUT MOUSE CO_ORDINATES ON CLICK ////////
    ctx.lineTo(e.clientX - 410, e.clientY - 80) 
    ctx.stroke()
  };
  

  ////////// CALL FUNCTIONS ///////////
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", paint)
  canvas.addEventListener("mouseout", finishedPosition)
  







  
});
