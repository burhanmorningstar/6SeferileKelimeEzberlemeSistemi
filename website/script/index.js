const apiUrl = "http://localhost:3000";
const urlParams = new URLSearchParams(window.location.search);
let userNameSpan;
userId = urlParams.get("user_id");
initializeGetUserNameAPI(userId);

function initializeGetUserNameAPI(user_id) {
  // Make a GET request to the API endpoint
  fetch(apiUrl + `/getUserName/${user_id}`)
    .then((response) => response.json())
    .then((data) => {
      // Get the user's full name from the response data
      const fullName = data.user_name;

      // Write the full name in the userName span
      userNameSpan = document.getElementById("userName");
      userNameSpan.textContent = "Hoşgeldin " + fullName;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
const parentWelcome = document.getElementById("parentWelcome");

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", () => {
  window.location.href = "login.html";
});
const signUpButton = document.getElementById("signUpButton");
signUpButton.addEventListener("click", () => {
  window.location.href = "signup.html";
});
const quizButton = document.getElementById("quizButton");
quizButton.addEventListener("click", () => {
  window.location.href = "quiz.html?user_id=" + userId;
});
const settingsButton = document.getElementById("settingsButton");
settingsButton.addEventListener("click", () => {
  window.location.href = "userSettings.html?user_id=" + userId;
});
if (userId) {
  quizButton.style.display = "inline-block";
  settingsButton.style.display = "inline-block";
  loginButton.style.display = "none";
  signUpButton.style.display = "none";
} else {
  quizButton.style.display = "none";
  settingsButton.style.display = "none";
  loginButton.style.display = "inline-block";
  signUpButton.style.display = "inline-block";
  parentWelcome.remove();
}
