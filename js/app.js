// Game variables - global
// *** move these into functions where possible
const guessedLettersList = document.getElementById('guessed-letters-list');

// const letterInput = document.getElementById('letter'); 
const wordInProgress = document.getElementById('word-in-progress');
const remainingGuessesP = document.getElementById('remaining');
const remainingGuessesSpan = document.getElementById('remaining-guesses');
const message = document.getElementById('message'); // create a message function?
const guessBtn = document.getElementById('guess-btn');
const playAgainBtn = document.getElementById('play-again-btn');

// adjust difficulty based on guesses available? Standard (8), Hard (6), Insanity (2)
let remainingGuesses = 8;
let word = 'magnolia';
let guessedLetters = [];

async function getWord() {
  const request = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
  const data = await request.text();
  const wordArray = data.split('\n'); // split on the break
  const randomIndex = Math.floor(Math.random() * wordArray.length);
  word = wordArray[randomIndex].trim(); // use trim to ensure any whitespace is eliminated
  console.log(word) // debug
  addPlaceholders(word);
}

// execute game
getWord();

// display dots for letters of word
function addPlaceholders(word) {
  const placeholderLetters = [];
  for (const letter of word) {
    placeholderLetters.push('●');
  }
  // Todo: check if this should be textContent
  wordInProgress.innerText = placeholderLetters.join(''); // make the array a string
}

// Validate player input is valid
function validatePlayerInput(input) {
  const validInput = /[a-zA-Z]/; // regex to check for valid character inputed

  if (input.length === 0) {
    message.textContent = 'Please enter a letter';
  } else if (input.length > 1) {
    message.textContent = `Give me one letter only.`;
  } else if (!input.match(validInput)) {
    message.textContent = `Yo! A letter from A to Z.`;
  } else {
    return input;
  }
}

// Make the guess
function makeGuess(letter) {
  letter = letter.toUpperCase();
  if (guessedLetters.includes(letter)) {
    message.innerText = `"${letter}" has already been guessed. Try again!`;
  } else {
    guessedLetters.push(letter);
    console.log('guessed letter pushed')
    // showGuessedLetters();
    // countGuessesRemaining(letter);
    // updateWordInProgress(guessedLetters);
  }
}

// listen for form submissions - guess made
document.getElementById('guess-form').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('guess submitted');
  message.textContent = '';

  const letterInput = document.getElementById('letter'); 
  const guessedLetter = letterInput.value;
  const validGuess = validatePlayerInput(guessedLetter);

  if (validGuess) makeGuess(guessedLetter);

  letterInput.value = '';

})