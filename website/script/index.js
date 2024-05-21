const apiUrl = "http://localhost:3000";
const urlParams = new URLSearchParams(window.location.search);
const userNameSpan = document.getElementById("username");
const userId = urlParams.get("user_id");

if (userId) {
  initializeGetUserNameAPI(userId);
  toggleButtonsVisibility(true);
} else {
  toggleButtonsVisibility(false);
  document.getElementById("parentWelcome")?.remove();
}

function initializeGetUserNameAPI(userId) {
  fetch(`${apiUrl}/getUserName/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      const fullName = data.user_name;
      userNameSpan.textContent = `Hoşgeldin, ${fullName}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function toggleButtonsVisibility(isLoggedIn) {
  const quizButton = document.getElementById("quizButton");
  const settingsButton = document.getElementById("settingsButton");
  const loginButton = document.getElementById("loginButton");
  const signUpButton = document.getElementById("signUpButton");

  if (isLoggedIn) {
    quizButton.style.display = "inline-block";
    settingsButton.style.display = "inline-block";
    loginButton.style.display = "none";
    signUpButton.style.display = "none";
  } else {
    quizButton.style.display = "none";
    settingsButton.style.display = "none";
    loginButton.style.display = "inline-block";
    signUpButton.style.display = "inline-block";
  }
}

document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.getElementById("signUpButton").addEventListener("click", () => {
  window.location.href = "signup.html";
});

document.getElementById("quizButton").addEventListener("click", () => {
  window.location.href = `quiz.html?user_id=${userId}`;
});

document.getElementById("settingsButton").addEventListener("click", () => {
  window.location.href = `userSettings.html?user_id=${userId}`;
});
