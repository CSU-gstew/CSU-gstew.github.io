
document.querySelector("#startBtn").addEventListener("click", startGame);
document.querySelector("#guessBtn").addEventListener("click", checkLetter);
document.querySelector("#resetBtn").addEventListener("click", resetGame);


let words = ["javascript", "coding", "developer", "computer", "variable"];
let selectedWord;
let guessedLetters;
let wrongLetters;
let maxWrong = 7;
let attempts;


function startGame() {

    selectedWord = words[Math.floor(Math.random() * words.length)];
    console.log("Selected word:", selectedWord);

    guessedLetters = [];
    wrongLetters = [];
    attempts = 0;

    document.querySelector("#startBtn").style.display = "none";
    document.querySelector("#gameArea").style.display = "block";
    document.querySelector("#resetBtn").style.display = "none";
    document.querySelector("#guessBtn").disabled = false;

    document.querySelector("#hangmanImg").src = "img/0.png";
    document.querySelector("#feedback").textContent = "";
    document.querySelector("#wrongLetters").textContent = "";
    document.querySelector("#remaining").textContent = maxWrong;

    document.querySelector("#letterInput").value = "";
    document.querySelector("#letterInput").focus();

    updateWordDisplay();
}

function updateWordDisplay() {

    let display = "";

    for (let i = 0; i < selectedWord.length; i++) {
        if (guessedLetters.includes(selectedWord[i])) {
            display += selectedWord[i] + " ";
        } else {
            display += "_ ";
        }
    }

    document.querySelector("#wordDisplay").textContent = display;
}


function checkLetter() {

    let input = document.querySelector("#letterInput");
    let letter = input.value.toLowerCase();
    let feedback = document.querySelector("#feedback");

    input.value = "";

    if (!letter.match(/^[a-z]$/)) {
        feedback.textContent = "Enter one valid letter!";
        feedback.style.color = "red";
        return;
    }

    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
        feedback.textContent = "You already guessed that!";
        feedback.style.color = "orange";
        return;
    }

    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
    } else {
        wrongLetters.push(letter);
        attempts++;

        document.querySelector("#hangmanImg").src =
            "img/" + attempts + ".png";

        feedback.textContent = "Wrong!";
        feedback.style.color = "red";

        document.querySelector("#wrongLetters").textContent =
            wrongLetters.join(" ");

        document.querySelector("#remaining").textContent =
            maxWrong - attempts;
    }

    updateWordDisplay();
    checkGameStatus();
}

function checkGameStatus() {

    let currentDisplay =
        document.querySelector("#wordDisplay").textContent;

    if (!currentDisplay.includes("_")) {
        document.querySelector("#feedback").textContent = "You Win!";
        document.querySelector("#feedback").style.color = "blue";
        endGame();
    }

    if (attempts >= maxWrong) {
        document.querySelector("#feedback").textContent =
            "Game Over! The word was " + selectedWord;
        document.querySelector("#feedback").style.color = "black";
        endGame();
    }
}

function endGame() {
    document.querySelector("#guessBtn").disabled = true;
    document.querySelector("#resetBtn").style.display = "inline";
}

function resetGame() {

    document.querySelector("#gameArea").style.display = "none";
    document.querySelector("#startBtn").style.display = "inline";

    document.querySelector("#hangmanImg").src = "img/0.png";
}