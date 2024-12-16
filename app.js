// Sound files to play for set events 
const ballThrowSound = new Audio("sounds/ball-throw.mp3");
const ballCatchSound = new Audio("sounds/ball-catch3.wav");
const ballMissSound = new Audio("sounds/ball-miss2.wav");
const lostGameSound = new Audio("sounds/lost-game.mp3");

let ThePlayerName = "";

// get handle to the needed DOM elements in the game
// get a handle/pointer to the basket so that it can be moved 
// left or right basked on the key pressed from the key press 
// (keydown) EventListner of the document object.
const basket = document.getElementById("basket");

const gameScreen = document.getElementById("gameScreen");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const playerForm = document.getElementById("playerForm");
const playerNameInput = document.getElementById("playerName");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
//const playerName = document.getElementsByClassName("playername");
//const scoreBoard = document.getElementById("scoreBoard");

// Game variables and counters
let score = 0;
let lives = 3;
let isGameOver = false;
//const ThePlayerName;

// Add a new event submit to the playerform (where user enters and presses the start button) so that game can begin after reseting to game start variables
playerForm.addEventListener("submit", (event) => {
  event.preventDefault(); /* prevent its default behavior of submitting */
  //console.log(event);
  //console.log("Player Name for object:",event.target.elements["playerName"].value);
  ThePlayerName = event.target.elements["playerName"].value;
  //ThePlayerName = playerForm.value;
  //console.log("Player Name:",playerForm.value);
  resetGame(); /* and we have have our own resetGame event triggered on submit event */

  //TheplayerName = document.getElementById("playerName").value;
});

//TheplayerName = playerForm.playerName;
//console.log(TheplayerName);

// Move the basket based to the left or right keydown event from EventListner 
document.addEventListener("keydown", (event) => {

    // if the game is over no need to read keys further
    if (isGameOver) return;

    //// get the postion of the bastket 
    const basketPosition = basket.offsetLeft; /* get the number of pixels the distance (in pixels) the left edge of the basket is away from its parent */
 //       console.log("---");
 //       console.log(`basket-clientWidth=${basket.clientWidth}`);        
 //       console.log(`basket-offsetleft=${basket.offsetLeft}`);
 //       console.log(`basketPosition=${basketPosition}`);        
 //       console.log(`basketPosition - basket.clientWidth=${basketPosition - basket.clientWidth}`);
    //move the basket left or rigth based on the left or right button pressed.
    if (event.key === "ArrowLeft") {
        if ((basketPosition - basket.clientWidth) > 20) {  /* move bastket only with in the parent container (gamescreen) so even if left key pressed dont move it too left beyond the gameScreen */
            basket.style.left = `${(basketPosition - 20)}px`; /* move the basket left by 20px when left key is pressed*/
        }
        else{
            basket.style.left = `${(basket.clientWidth/2)}px`;
        } 
    }
    else if (event.key === "ArrowRight") { 
 //       console.log("---");
 //       console.log(`basket.clientWidth=${basket.clientWidth}`);          
 //       console.log(`basketPosition=${basketPosition}`);        
 //       console.log(`basketPosition + basket.clientWidth=${basketPosition  + basket.clientWidth}`);        
 //       console.log(`gameScreen.clientWidth=${gameScreen.clientWidth}`);
 //       console.log(`basketPosition + 20=${basketPosition + 20}`);        
 //       console.log(`((gameScreen.clientWidth -(basketPosition  + basket.clientWidth)))=${((gameScreen.clientWidth -(basketPosition  + basket.clientWidth)))}`);
        if ((gameScreen.clientWidth - (basketPosition + basket.clientWidth)) > 20) {  /* move bastket only with in the parent container (gamescreen) so even if right pressed dont move it right beyond the gameScreen */
//        if ((gameScreen.clientWidth - basketPosition) > 20) {  /* move bastket only with in the parent container (gamescreen) so even if right pressed dont move it right beyond the gameScreen */
                basket.style.left = `${(basketPosition + 20)}px`; /* move the basket right by 20px when right key is pressed*/
        }
        else{
            basket.style.left = `${(basketPosition+((gameScreen.clientWidth -(basketPosition + basket.clientWidth)))+(basket.clientWidth/2))}px`;
        }        
    }
});

// Spawn/Throw a new ball
function spawnBall() {

    // if game is not on then no need to spawnball. This might be helpful to check as multiple events occur simultaneously
    if (isGameOver) return;

    // play the ball throw sound from the beginner
    ballThrowSound.currentTime = 0;
    ballThrowSound.play();
  
    // create the ball element dynamically to be thrown from the top of its parent element gameScreen
    const ball = document.createElement("div"); /* create the ball  */
    ball.classList.add("ball");  /* add the created ball to the its classlist collection */
    ball.style.left = `${Math.random() * (gameScreen.clientWidth - 20)}px`; /* assign a ramdom value to the location of the ball within the gameScreen area */
    gameScreen.appendChild(ball); /* make the ball a child of the gameScreen container */ 
  
    // Set the starting position of the ball
    let ballPosition = 0;

    // Start the animation or moving of the ball and continusouly monitor the the position of the ball every 5 milliseconds for collision of the ball with the basket
    const ballInterval = setInterval(() => { /* this setInterval function runs every 5 milliseconds  (see botton ,50)*/
      ballPosition += 5; /* advance the ball counter by 5 counts */
      ball.style.top = `${ballPosition}px`; /* advance the ball on the screen by that many (ballposition counter) pixels */
  
      // Check for the possible ball basket collision only after the ball reaches close to bottom of the gameScreen past the basket level to see if ball missed or caught
      if (ballPosition >= gameScreen.clientHeight - 40) { /* ball has reached the bottom of gameScreen */
        const ballRect = ball.getBoundingClientRect(); /* get the bounderies of the ball element */
        const basketRect = basket.getBoundingClientRect(); /* get the bounderies of the basket element */

        /* if ball basket collided yet or not*/
        if (ballRect.left >= basketRect.left && ballRect.right <= basketRect.right) {  
          ballCaught(ball, ballInterval);  /* collided that means it was caught so continue to do ballcaught items */
        } else {
          ballMissed(ball, ballInterval);  /* not collided that means it was not caught so continue to do ballmissed items */
        }
      }
    }, 50);
}

// Ball is caught in the basket 
function ballCaught(ball, ballInterval) {
    /* play the ball cought sound */
    ballCatchSound.currentTime = 0;
    ballCatchSound.play();
  
    /* inc the score and display it */
    score++;
    scoreDisplay.textContent = score;
    
    /* stop the repeated execution of the animation of the ball that was sent when the ball was thrown/spawn */
    clearInterval(ballInterval);
    ball.remove(); /* since we threw/spawned this ball specially we simply remove it from the game since it has been caught and no longer needed in the game. therefore we dont need need to loop thru looking for any and all the balls in documents classlist like we do in clearballs function for surety */
  
    /* force a delay before the next ball is thrown/spawn */
    setTimeout(() => spawnBall(), 1500); 
}

// Ball was not caught, ball was missed. 
// if missed then it could have been missed with no lives left or more lives left, so proceed game accordingly
function ballMissed(ball, ballInterval) {

    /* play the ballmissed sound */
    ballMissSound.currentTime = 0; /* paly the sound from the beginngin */
    ballMissSound.play();
  
    /* stop the repeated execution of the animation of the ball that was sent when the ball was thrown/spawn */
    clearInterval(ballInterval);

    /* start teh animation of the ball - transition */
    ball.style.transition = "top 1s ease-in"; /* Set the transition effort to start slowly and then slowly speed up */
    ball.style.top = `${gameScreen.clientHeight + 50}px`; /* set the location of the ball to start dropping from */ 
    setTimeout(() => ball.remove(), 1000); /*after every 1 sec remove that ball so the next ball can be place with the animation offset */
 
    /* update the number of lives after the missedball and disply it add color to the no of lives left*/
    lives--;
    livesDisplay.textContent = `${lives}/3`;
    parent;
    switch (lives) {
        case 2: 
            livesDisplay.style.color = "rgb(241, 217, 76)";
            livesDisplay.style.fontWeight = "bold"; 
            parent = gameScreen.parentNode; 
            //console.log(grandparent.id);
            parent.style.boxShadow = "10px 10px 5px rgb(255, 255, 0)";           
            break;
        case 1: 
            livesDisplay.style.color = "red";
            livesDisplay.style.fontWeight = "bold"; 
            parent = gameScreen.parentNode; 
            //console.log(grandparent.id);
            parent.style.boxShadow = "10px 10px 5px rgb(255, 0, 0)";
            //gameScreen.parentElement.backgroundColor= "red";
            //gameScreen.forEach (sibling)
            //const siblings = Array.from(gameScreen.siblings);
            //scoreBoard.forEach(child)

            //scoreBoard.forEach((child) => {
            //    console.log(child.id);
            //    child.style.Color = "red"; 
            //scoreBoard.parentNode.style.boxShadow = "0 0 10px rgb(255, 0, 0)";    
            //    for (let child of scoreBoard.children) {
            //        if (child.tagName === "P") {
            //          const span = child.querySelector("span"); // Access the <span> inside <p>
            //          span.style.color = "red"; // Change text color to blue
            //        }
            //      }
                //if (sibling !== currentElement) {
                //    console.log(sibling); // Do something with each sibling
                //    sibling.style.backgroundColor = 'red'; // Example: Change background
               // }
            //});
            //console.log(gameScreen.sibliparentElement.backgroundColor);
                //if (child.id !== "basket") {
                //    console.log(child.child.id);
                //    child.child.style.Color = "red"; 
                //    console.log(child.child.style.Color);
                //    child.child.style.fontWeight  = "bold"; 
                //}
//            gameScreen.forEach ((child) => {
//                child.background.color = "red"; // Default
//                setTimeout(() => endGame(), 1500);
//                child.background.color = "transparent"; 
//            })            
            break;
        default :
            //livesDisplay.style.color = "black";
            //livesDisplay.style.fontWeight = "normal"; 
    }

    // if no lives left end game if not continue 
    if (lives === 0) {
      setTimeout(() => endGame(), 1500); /* force a delay so that sounds can be played and restart game window can be shown so the transition is not abrupt */
      lostGameSound.currentTime = 0; /* play the sound from the beginner */
      lostGameSound.play(); /* paly the sound */
    } else {
      setTimeout(() => spawnBall(), 1500); /* force a delay so that sounds can be played and next ball can be thrown so the transition is not abrupt */
    }
  /*  if (lives === 0) {
      endGame();
    } else {
      setTimeout(() => spawnBall(), 1500); // Delay before next ball
    }
  */
}

// Clear removes ball from the game screen (usually when the fame is over)
function clearBalls() {
    /* is seems necessary to remove all .ball elements using a loop because since the .ball element is created dynamically there could be a csenarios wehre mulitple .ball elements are created especially after end game and before start game and after ball catch failed and ball throw starts */
    document.querySelectorAll(".ball").forEach((ball) => ball.remove());  /* look thru the document element by selecting all elements by name ball and remove them.  */
}

// End game if status of game is gameover and display final score and display the by unhiding the game over screen class from the class list */
function endGame() {

    isGameOver = true;
    finalScore.textContent = `${ThePlayerName}: Your Final Score: ${score}`; /* display final score */
    gameOverScreen.classList.remove("hidden"); /* unhiding the gameoverscrreen element a form (remove the hidden class from the gameOverScrreen element's list of classes that was added earlier) in the classList collection of gameOverSreen element */
    //const grandparent = gameScreen.parentNode; // Access grandparent
    //console.log(grandparent.id);
    
}

// Restart game by adding a click event to the EventListener prperty list of the restartBtn element so that click event can be captures when the user presses the restartBtn to resetGame and start the game all over again */
restartBtn.addEventListener("click", resetGame);

// reset all the game variable and elements to start status
function resetGame() {
    isGameOver = false;
    score = 0;
    lives = 3;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = `${lives}/3`;
    livesDisplay.style.color = "green";
    livesDisplay.style.fontWeight = "bold"; 
    gameOverScreen.classList.add("hidden"); /* make the game over form hidden by adding a hidden class with display set to none to make it disappear*/
    gameOverScreen.parentNode.style.boxShadow = "10px 10px 5px rgba(0, 0, 0, 1.0)";
    clearBalls();
    spawnBall();
  }
  
