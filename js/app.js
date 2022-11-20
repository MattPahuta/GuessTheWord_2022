// Game variables - global
const guessedLettersList = document.querySelector('.guessed-letters');
const wordInProgress = document.getElementById('word-in-progress');
const remainingGuessesP = document.getElementById('remaining');
const remainingGuessesSpan = document.getElementById('remaining-guesses');
const message = document.getElementById('message');
const guessBtn = document.getElementById('guess-btn');
const playAgainBtn = document.getElementById('play-again-btn');

// adjust difficulty based on guesses available? Standard (8), Hard (6), Insanity (2)
let remainingGuesses = 8;
let word = 'magnolia'; // default value
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

// modal form - choose difficulty setting (8 guesses, 6 guesses, 4 guesses)
function setDifficulty() {

}

// display dots for letters of word
function addPlaceholders(word) {
  const placeholderLetters = [];
  for (const letter of word) {
    placeholderLetters.push('●');
  }
  wordInProgress.textContent = placeholderLetters.join('');
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
    message.textContent = `"${letter}" has already been guessed. Try again!`;
  } else {
    guessedLetters.push(letter);
    console.log('guessed letter pushed')
    showGuessedLetters();
    trackGuessesRemaining(letter);
    updateWordInProgress(guessedLetters);
  }
}

// Show letters guessed
function showGuessedLetters() {
  guessedLettersList.innerHTML = ''; // clear the guessedLettersUL
  guessedLetters.forEach(letter => {
    const li = document.createElement('li');
    li.textContent = letter;
    guessedLettersList.append(li)
  });
}

// Update the hidden word to guess
function updateWordInProgress(guessedLetters) {
  const wordUpper = word.toUpperCase(); // make word upperCase globally?
  const wordArray = wordUpper.split('');
  const revealWord = [];

  wordArray.forEach(letter => {
    guessedLetters.includes(letter) ? revealWord.push(letter.toUpperCase()) : revealWord.push('●')
  })

  wordInProgress.textContent = revealWord.join('');
  checkWin();
}

// Track number of guesses remaining 
function trackGuessesRemaining(guess) {
  const wordUpper = word.toUpperCase();  // make word upperCase globally?

  if (!wordUpper.includes(guess)) {
    message.textContent = `Nope. "${guess}" is not in the word.`;
    remainingGuesses -= 1;
  } else {
    message.textContent = `Horray! "${guess}" is in the word.`;
  }

  if (remainingGuesses === 0) {
    message.innerHTML = `Bummer. You lose!  <span class="reveal">${wordUpper}</span> was the word.`
    startOver();
  } else if (remainingGuesses === 1) {
    remainingGuessesSpan.textContent = `${remainingGuesses} guess`;
    remainingGuessesSpan.classList.add('danger');
  } else {
    remainingGuessesSpan.textContent = `${remainingGuesses} guesses`;
  }

}

function checkWin() {
  if (word.toUpperCase() === wordInProgress.innerText) {
    message.classList.add('win');
    message.textContent = `You guessed it! Congrats!`;
    startOver();
  }
}

// replay game
function startOver() {
  guessBtn.classList.add('hide');
  remainingGuessesP.classList.add('hide');
  guessedLettersList.classList.add('hide');
  playAgainBtn.classList.remove('hide');
}

function resetGame() {
  message.classList.remove('win');
  guessedLetters.length = 0;
  remainingGuesses = 8;
  remainingGuessesSpan.textContent = `${remainingGuesses} guesses`;
  remainingGuessesSpan.classList.remove('danger');
  guessedLettersList.innerHTML = '';
  message.textContent = '';
  getWord();
  guessBtn.classList.remove('hide');
  remainingGuessesP.classList.remove('hide');
  guessedLettersList.classList.remove('hide');
  playAgainBtn.classList.add('hide');
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

playAgainBtn.addEventListener('click', resetGame);