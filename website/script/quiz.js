const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("user_id");
// Kullanıcı ayarlarını tutacak değişkenler
let wordLimit = 10; // Kelime limiti
let nextAskDate = new Date(); // Sonraki sorma tarihi

// Kelimeleri tutacak dizi
let words = [];
let apiUrl = 'http://localhost:3001';

// API'den kelimeleri alma fonksiyonu
const fetchWords = async () => {
  try {
    const response = await fetch(apiUrl + `/questions?userId=${userId}&wordLimit=${wordLimit}`);
    const data = await response.json();
    words = data;
    updateHtml(words.shift());
  } catch (error) {
    console.error('Error fetching words:', error);
  }
};

// Sonraki soruyu getiren fonksiyon
const getNextQuestion = () => {
  if (words.length > 0) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const nextQuestion = words[randomIndex];
    words.splice(randomIndex, 1); // Seçilen kelimeyi listeden kaldır
    updateHtml(nextQuestion);
  } else {
    console.log('No more questions available.');
  }
};

// Cevabı kontrol eden fonksiyon
const checkAnswer = async (wordId, answer) => {
  try {
    const response = await fetch('/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        wordId,
        answer
      })
    });
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error checking answer:', error);
  }
};

// HTML'i güncelleyen fonksiyon
const updateHtml = (question = null) => {
    console.log(question);
  const questionContainer = document.getElementById('question-container');
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
      <button onclick="submitAnswer(${question.word_id})">Submit</button>
    `;
  } else {
    questionContainer.innerHTML = '<p>No more questions available.</p>';
  }
};

// Cevabı gönderen fonksiyon
const submitAnswer = (wordId) => {
  const answerInput = document.getElementById('answer');
  const answer = answerInput.value.trim();
  if (answer == '') {
    console.log('Please enter an answer.');
  } else {
    checkAnswer(wordId, answer);
    answerInput.value = ''; // Inputu temizle
    getNextQuestion(); // Sonraki soruya geç    
  }
};

fetchWords();