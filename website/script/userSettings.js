const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("user_id");
const apiUrl = "http://localhost:3003";

document
  .getElementById("settingsForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const wordLimitSetting = document.getElementById("wordLimitSetting").value;

    const settingsData = {
      wordLimit: wordLimitSetting,
      userId: userId,
    };

    try {
      const response = await fetch(apiUrl + "/save-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        alert("Ayarlar başarıyla kaydedildi.");
      } else {
        throw new Error("Ayarlar kaydedilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      alert("Ayarlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  });

  async function fetchAnalysisReport() {
    try {
      const response = await fetch(apiUrl + "/get-analysis?user_id=" + userId);
      const data = await response.json();
  
      const analysisReportDiv = document.getElementById("analysisReport");
      analysisReportDiv.innerHTML = `
        <p>Toplam Kelime Sayısı: ${data.totalWords}</p>
        <p>Başarı Yüzdesi: ${data.successPercentage}%</p>
        <p>Yanlış Sayısı: ${data.totalWrong}</p>
        <p>Doğru Sayısı: ${data.totalCorrect}</p>
        <p>Toplam Sayı: ${data.totalAsked}</p>
        <h3>Detaylı Rapor:</h3>
        <ul>
          ${data.words.map(word => `
            <li>
              <strong>Kelime:</strong> ${word.word} <br>
              <strong>Seviye:</strong> ${word.word_counter}<br>
              <strong>Doğru Sayısı:</strong> ${word.how_many_correct_answers}<br>
              <strong>Yanlış Sayısı:</strong> ${word.how_many_wrong_answers}
            </li>
          `).join('')}
        </ul>
      `;
    } catch (error) {
      console.error("Analiz raporu alınırken bir hata oluştu:", error);
    }
  }
  
// Sayfa yüklendiğinde analiz raporunu al
window.onload = fetchAnalysisReport;
