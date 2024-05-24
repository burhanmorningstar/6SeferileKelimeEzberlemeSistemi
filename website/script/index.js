const apiUrl = "http://localhost:3000";
const urlParams = new URLSearchParams(window.location.search);
const userNameSpan = document.getElementById("username");
const userId = urlParams.get("user_id");

const quizButton = document.getElementById("quizButton");
const settingsButton = document.getElementById("settingsButton");
const loginButton = document.getElementById("loginButton");
const signUpButton = document.getElementById("signUpButton");
const welcome = document.getElementById("welcome");
const wordAddButton = document.getElementById("wordAddButton");
const logOutButton = document.getElementById("logoutButton");

if (userId) {
  initializeGetUserNameAPI(userId);
  toggleButtonsVisibility(true);
} else {
  toggleButtonsVisibility(false);
  document.getElementById("parentWelcome")?.remove();
}

// Kullanıcı adını almak için API'yi başlat
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

// Giriş durumuna göre düğmelerin görünürlüğünü değiştir
function toggleButtonsVisibility(isLoggedIn) {
  if (isLoggedIn) {
    quizButton.style.display = "block";
    settingsButton.style.display = "block";
    loginButton.style.display = "none";
    signUpButton.style.display = "none";
    welcome.style.display = "none";
    logOutButton.style.display = "block";
    wordAddButton.style.display = "block";
  } else {
    quizButton.style.display = "none";
    settingsButton.style.display = "none";
    loginButton.style.display = "block";
    signUpButton.style.display = "block";
    welcome.style.display = "block";
    logOutButton.style.display = "none";
    wordAddButton.style.display = "none";
  }
}

loginButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

signUpButton.addEventListener("click", () => {
  window.location.href = "signup.html";
});

quizButton.addEventListener("click", () => {
  window.location.href = `quiz.html?user_id=${userId}`;
});

settingsButton.addEventListener("click", () => {
  window.location.href = `userSettings.html?user_id=${userId}`;
});

wordAddButton.addEventListener("click", () => {
  window.location.href = `wordAdd.html?user_id=${userId}`;
});

logOutButton.addEventListener("click", () => {
  $.removeCookie("user_id", { path: "/" });
  window.location.href = "index.html";
});
