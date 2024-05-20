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

    const analysisChartCanvas = document.getElementById("analysisChart");
    const analysisReportDiv = document.getElementById("analysisReport");
    // Grafik oluşturma
    const ctx = analysisChartCanvas.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Doğru Cevaplar", "Yanlış Cevaplar"],
        datasets: [
          {
            label: "Cevaplar",
            data: [data.totalCorrect, data.totalWrong],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
      },
    });

    // Detaylı raporu ekrana yazdır
    analysisReportDiv.innerHTML += `
            <p>Toplam Kelime Sayısı: ${data.totalAsked}</p>
            <p>Başarı Yüzdesi: ${data.successPercentage}%</p>
            <p>Yanlış Sayısı: ${data.totalWrong}</p>
            <p>Doğru Sayısı: ${data.totalCorrect}</p>
            <p>Toplam Sayı: ${data.totalAsked}</p>
            <h3>Detaylı Rapor:</h3>
            <ul>
                ${data.words
                  .map(
                    (word) => `
                    <li>
                        <strong>Kelime:</strong> ${word.word} <br>
                        <strong>Seviye:</strong> ${word.word_counter}<br>
                        <strong>Doğru Sayısı:</strong> ${word.how_many_correct_answers}<br>
                        <strong>Yanlış Sayısı:</strong> ${word.how_many_wrong_answers}
                    </li>
                `
                  )
                  .join("")}
            </ul>
        `;
  } catch (error) {
    console.error("Analiz raporu alınırken bir hata oluştu:", error);
  }
}
if (userId) {
  analysisChartDiv.style.display = "block";
  analysisReport.style.display = "block";
  settingsForm.style.display = "block";
}

// Sayfa yüklendiğinde analiz raporunu al
window.onload = fetchAnalysisReport;
