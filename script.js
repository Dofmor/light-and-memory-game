// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
// Sound Synthesis Functions
const freqMap = {
  1: 200,
  2: 250,
  3: 300,
  4: 350,
  5: 400
};


//Global Variables
var pattern = [2, 5, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000;// jpw long to hold each clue's light/sound

//funtion that starts the game
function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

//function that stops the game
function stopGame() {
  gamePlaying = false;

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

//function that plays the tone of the button
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}

//function that stops the button tone
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//function that gives buttons the "lit" class
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

//function that clears the buttons "lit" class
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

//function that plays a single button clue
function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += (clueHoldTime - (40 * progress));
    console.log("progress: " + progress);
    delay += cluePauseTime; 
  }
}

//function that ends the the game if the user lost
function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

//function that ends the game if the user won
function winGame() {
  stopGame();
  alert("Game Over. You won.");
}

//function that tracks the users guesses
function guess(btn) {
  console.log("user guessed: " + btn);

  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    //correct guess
    if (guessCounter == progress) {
      if (progress == pattern.length-1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } 
    else {
      guessCounter++;
      console.log("guessCounter: " + guessCounter);
    }
  } 
  else {
    loseGame();
  }
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
