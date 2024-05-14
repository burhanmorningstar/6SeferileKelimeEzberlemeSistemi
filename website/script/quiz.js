// Kullanıcı cevaplarını saklayacak diziler
let correctAnswers = [];
let wrongAnswers = [];
let userAnswers = [];
let questions = [];
let currentQuestionIndex = 0;

// API URL'leri
const wordApiUrl = "http://localhost:3001";
const userApiUrl = "http://localhost:3000";

// fetchQuestions fonksiyonunu düzenleyin
function fetchQuestions(userId) {
  fetch(wordApiUrl + "/questions/" + userId)
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      showFirstQuestion(); // fetch işlemi tamamlandığında ilk soruyu göster
    })
    .catch((error) =>
      console.error("Kelime alınırken bir hata oluştu:", error)
    );
}

// İlk soruyu gösterme
function showFirstQuestion() {
  const firstQuestion = questions[0];
  updateHtml(firstQuestion);
}

// Sonraki soruyu gösterme
function showNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    const nextQuestion = allQuestions[currentQuestionIndex];
    updateHtml(nextQuestion);
  } else {
    console.log("Tüm sorular gösterildi.");
    // Tüm sorular gösterildiyse sonuçları gösterme modal'ını göster
    showResultModal();
  }
}

// API'den gelen cevaba göre işlem yapacak fonksiyon
async function submitAnswer(wordId, userId) {
  const answer = document.getElementById("answer").value;
  userAnswers.push(answer);
  const response = await fetch(wordApiUrl + "/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      wordId,
      answer,
    }),
  });
  const result = await response.json();

  // Doğru veya yanlış cevaba göre diziye ekleme
  if (result.message === "Correct answer!") {
    correctAnswers.push(wordId);
  } else {
    wrongAnswers.push(wordId);
  }

  // Sonraki soruyu göster
  showNextQuestion();
}
// submitBtn event listener'ını düzenleyin
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", submitAnswer);

// HTML'i güncelleyecek fonksiyon
const updateHtml = (question) => {
  const questionContainer = document.getElementById("question-container");
  if (question) {
    questionContainer.innerHTML = `
      <div>
        <p>English: ${question.word}</p>
        <p>Sentence: ${question.word_in_sentence}</p>
        <img src="${question.word_image}" alt="Image">
        <audio controls>
          <source src="${question.word_voice}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
      <input type="text" id="answer" placeholder="Enter your answer">
      <button id="submitBtn">Submit</button>
    `;
    const imageSrc = question.word_image;
    const audioSrc = question.word_voice;

    document.getElementById("image").src = imageSrc;
    document.getElementById("audio").src = audioSrc;
  } else {
    questionContainer.innerHTML = "<p>No more questions available.</p>";
  }
};

// questionCheck fonksiyonunu düzenleyin
function questionCheck(userAnswer, correctAnswer) {
  if (userAnswer === correctAnswer) {
    return 1;
  } else {
    return 0;
  }
}

// Modalı gösterme
function showResultModal() {
  const modalContent = document.getElementById("results");
  const tbody = document.getElementById("cevaplar-tablosu");
  tbody.innerHTML = "";

  for (let i = 0; i < correctAnswers.length; i++) {
    const tr = document.createElement("tr");

    const tdSoru = document.createElement("td");
    tdSoru.textContent = questions[i].word;
    tr.appendChild(tdSoru);

    const tdKullaniciCevabi = document.createElement("td");
    const kullaniciCevabi = userAnswers[i];
    tdKullaniciCevabi.textContent = kullaniciCevabi
      ? kullaniciCevabi.toLowerCase() === "doğru"
        ? "Doğru"
        : "Yanlış"
      : "-";
    tr.appendChild(tdKullaniciCevabi);

    const tdDogruCevap = document.createElement("td");
    tdDogruCevap.textContent = correctAnswers[i];
    tr.appendChild(tdDogruCevap);

    const tdSonuc = document.createElement("td");
    const questionCheck = questionCheck(userAnswers[i], correctAnswers[i]);
    tdSonuc.textContent = questionCheck === 1 ? "Doğru" : "Yanlış";
    tr.appendChild(tdSonuc);

    tbody.appendChild(tr);
  }

  // Modalı göster
  $("#resultModal").modal("show");
}

// Kullanıcı kimliğiyle soruları göster
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("user_id");
fetchQuestions(userId);
showFirstQuestion();
