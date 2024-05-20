const apiUrl = 'http://localhost:3000';
const urlParams = new URLSearchParams(window.location.search);
userId = urlParams.get("user_id");
initializeGetUserNameAPI(userId);

function initializeGetUserNameAPI(user_id) {
    // Make a GET request to the API endpoint
    fetch(apiUrl + `/getUserName/${user_id}`)
        .then(response => response.json())
        .then(data => {
            // Get the user's full name from the response data
            const fullName = data.user_name;

            // Write the full name in the userName span
            const userNameSpan = document.getElementById('userName');
            userNameSpan.textContent = "Hoşgeldin " + fullName;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', () => {
    window.location.href = 'login.html';
});
const signUpButton = document.getElementById('signUpButton');
signUpButton.addEventListener('click', () => {
    window.location.href = 'signup.html';
});
const quizButton = document.getElementById('quizButton');
quizButton.addEventListener('click', () => {
    window.location.href = "quiz.html?user_id=" + userId;
});
if (userId) {
    quizButton.style.display = "block";
}