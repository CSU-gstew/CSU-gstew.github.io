let usernameAvailable = false;

document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#pwd").addEventListener("click", displaySuggestedPassword);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

loadStates();

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function loadStates() {
  let url = "https://csumb.space/api/allStatesAPI.php";
  let data = await fetchData(url);

  const stateSelect = document.querySelector("#state");
  stateSelect.innerHTML = "<option value=''>Select One</option>";

  for (let state of data) {
    let option = document.createElement("option");
    option.value = state.usps;
    option.textContent = state.state;
    stateSelect.appendChild(option);
  }
}

async function displayCounties() {
  let state = document.querySelector("#state").value;
  if (!state) return;

  let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
  let data = await fetchData(url);

  const countySelect = document.querySelector("#county");
  countySelect.innerHTML = "<option>Select County</option>";

  for (let county of data) {
    let option = document.createElement("option");
    option.textContent = county.county;
    countySelect.appendChild(option);
  }
}

async function displayCity() {

  document.querySelector("#city").textContent = "";
  document.querySelector("#lat").textContent = "";
  document.querySelector("#long").textContent = "";
  document.querySelector("#cityError").textContent = "";

  let zip = document.querySelector("#zip").value;
  let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zip}`;
  let data = await fetchData(url);

  if (data == false) {
    document.querySelector("#cityError").textContent = " Zip code not found";
  } else {
    document.querySelector("#city").textContent = data.city;
    document.querySelector("#lat").textContent = data.latitude;
    document.querySelector("#long").textContent = data.longitude;
  }
}

async function checkUsername() {

  let username = document.querySelector("#username").value;
  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
  let data = await fetchData(url);

  const usernameError = document.querySelector("#usernameError");

  if (data.available) {
    usernameError.textContent = "Username Available";
    usernameError.className = "success";
    usernameAvailable = true;
  } else {
    usernameError.textContent = "Username NOT Available";
    usernameError.className = "error";
    usernameAvailable = false;
  }
}

async function displaySuggestedPassword() {
  let url = "https://csumb.space/api/suggestedPassword.php?length=8";
  let data = await fetchData(url);

  document.querySelector("#suggestedPwd").textContent =
    " Suggested: " + data.password;
}

function validateForm(e) {

  let errors = [];
  let username = document.querySelector("#username").value;
  let password = document.querySelector("#pwd").value;
  let password2 = document.querySelector("#pwd2").value;

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters.");
  }

  if (!usernameAvailable) {
    errors.push("Username must be available.");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (password !== password2) {
    errors.push("Passwords must match.");
  }

  if (errors.length > 0) {
    e.preventDefault();
    document.querySelector("#formErrors").innerHTML = errors.join("<br>");
  }
}