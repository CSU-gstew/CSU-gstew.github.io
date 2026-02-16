// console.log("Running");

// let correctNumber = Math.floor(Math.random() * 99);
// let correctMessage = "Congrats!";
// let incorrectMessage = "Wrong!";
// let tooHigh = "Too High!";
// let tooLow = "Too Low!";
// let guessCount = 0;
// let guess = "Total Guesses: ";
// let minGuessSuccess = "You guessed within 7 attempts!";

// let guessInput = document.querySelector("#guessInput");
// let guessButton = document.querySelector("#guessButton");
// let guessResult = document.querySelector("#guessResult");
// let highLow = document.querySelector("#highLow");
// let totalGuesses = document.querySelector("#totalGuesses");
// let minGuess = document.querySelector("#minGuess");

// function rightGuess(){
//     guessResult.textContent = correctMessage;
//     guessResult.style.color = "green";
//     highLow.textContent = "";
//     guessCount++;
//     totalGuesses.textContent = guess + guessCount;
//     minGuess.textContent = minGuessSuccess;
//     minGuess.style.color = "green";
// }

// function wrongGuess(){
//     guessResult.textContent = incorrectMessage;
//     guessResult.style.color = "red";
//     highLow.style.color = "red";
// }


// guessButton.addEventListener("click", function displayWinMessage() {

//     if(guessCount <= 7){
//         if(correctNumber == guessInput.value){
            
//         }
//         else if() {
//                 wrongGuess();
//                 guessCount++;
//                 totalGuesses.textContent = guess + guessCount;
//                 minGuess.textContent = "You didn't guess within 7 attempts!";
//                 minGuess.style.color = "red";
//         }
//     }
//     else if (guessInput.value > correctNumber){
//         highLow.textContent = tooHigh;
//         wrongGuess();
//     }
//     else if(guessInput.value < correctNumber){
//         highLow.textContent = tooLow;
//         wrongGuess();
//     }
// });

//Leaving my previous code here just for reference, now using the code from the Guess a Number
//tutorial since it's much cleaner and easy to use, better than having to fix all my busted code.

document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);
let randomNumber;
let attempts;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
   randomNumber = Math.floor(Math.random() * 99) + 1;
   console.log("randomNumber: " + randomNumber);
   attempts = 0;


   document.querySelector("#resetBtn").style.display = "none";

   document.querySelector("#guessBtn").style.display = "inline";

   let playerGuess = document.querySelector("#playerGuess");
   playerGuess.focus();
   playerGuess.value = "";

   let feedback = document.querySelector("#feedback");
   feedback.textContent = "";

   document.querySelector("#guesses").textContent = "";
}

function checkGuess(){
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    if(guess < 1 || guess > 99){
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }
    attempts++;
    console.log("Attempts:" + attempts);
    feedback.style.color = "orange";
    if(guess == randomNumber){
        feedback.textContent = "You guessed it in under 7 attempts!";
        feedback.style.color = "green";
        wins++;
        document.querySelector("#wins").textContent = wins;
        gameOver();
    }
    else{
        document.querySelector("#guesses").textContent += guess + " ";
        if(attempts == 7){
            feedback.textContent = "You lost! The random number was " + randomNumber;
            feedback.style.color = "red";
            losses++;
            document.querySelector("#losses").textContent = losses;
            gameOver();
        }
        else if(guess > randomNumber){
            feedback.textContent = "Too High!";

        }else{
            feedback.textContent = "Too Low!";
        }
    }
}
function gameOver(){
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none";
    resetBtn.style.display = "inline";
}


