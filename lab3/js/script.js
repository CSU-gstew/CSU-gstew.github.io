document.querySelector("button").addEventListener("click", gradeQuiz);
displayQ4Choices();

var score = 0;
var attempts = localStorage.getItem("total_attempts")
  ? parseInt(localStorage.getItem("total_attempts"))
  : 0;

function displayQ4Choices() {
  let states = ["Otter", "Dolphin", "Pelican", "Seagull"];
  states = _.shuffle(states);

  for (let state of states) {
    document.querySelector("#q4Choices").innerHTML += `
      <input type="radio" name="q4" id="${state}" value="${state}">
      <label for="${state}">${state}</label>
    `;
  }
}

function isFormValid() {
  if (document.querySelector("#q1").value === "") {
    document.querySelector("#validationFdbk").textContent =
      "Please answer Question 1.";
    return false;
  }
  document.querySelector("#validationFdbk").textContent = "";
  return true;
}

function rightAnswer(index) {
  document.querySelector(`#q${index}Feedback`).textContent = "Correct!";
  document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
  document.querySelector(`#markImg${index}`).innerHTML =
    `<img src="img/check.png" width="25">`;
  score += 20;
}

function wrongAnswer(index) {
  document.querySelector(`#q${index}Feedback`).textContent = "Incorrect!";
  document.querySelector(`#q${index}Feedback`).className = "bg-danger text-white";
  document.querySelector(`#markImg${index}`).innerHTML =
    `<img src="img/x.png" width="25">`;
}

function gradeQuiz() {
  if (!isFormValid()) return;

  score = 0;

  document.querySelector("#q1").value.trim().toLowerCase() === "seaside"
    ? rightAnswer(1)
    : wrongAnswer(1);

  document.querySelector("#q2").value === "1994"
    ? rightAnswer(2)
    : wrongAnswer(2);

  let q3Correct =
    document.querySelector("#Starbucks").checked &&
    !document.querySelector("#WildPie").checked &&
    document.querySelector("#Burger831").checked &&
    document.querySelector("#Sono").checked;

  q3Correct ? rightAnswer(3) : wrongAnswer(3);

  let q4 = document.querySelector("input[name=q4]:checked");
  q4 && q4.value === "Otter"
    ? rightAnswer(4)
    : wrongAnswer(4);

  document.querySelector("#q5").value === "3"
    ? rightAnswer(5)
    : wrongAnswer(5);

  let scoreEl = document.querySelector("#totalScore");
  scoreEl.textContent = `Total Score: ${score}`;
  scoreEl.style.color = score >= 80 ? "green" : "red";

  if (score >= 80) {
    scoreEl.textContent += " 🎉 Congratulations!";
  }

  attempts++;
  localStorage.setItem("total_attempts", attempts);
  document.querySelector("#totalAttempts").textContent =
    `Total Attempts: ${attempts}`;
}