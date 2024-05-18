const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("user_id");
const apiUrl = 'http://localhost:3003';

document.getElementById('settingsForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const wordLimitSetting = document.getElementById('wordLimitSetting').value;
    const wordDateSetting = document.getElementById('wordDateSetting').value;

    const today = new Date();
    let targetDate;
    switch (wordDateSetting) {
        case '1day':
            targetDate = new Date(today.setDate(today.getDate() + 1));
            break;
        case '7days':
            targetDate = new Date(today.setDate(today.getDate() + 7));
            break;
        case '1month':
            targetDate = new Date(today.setMonth(today.getMonth() + 1));
            break;
        case '3months':
            targetDate = new Date(today.setMonth(today.getMonth() + 3));
            break;
        case '6months':
            targetDate = new Date(today.setMonth(today.getMonth() + 6));
            break;
        case '1year':
            targetDate = new Date(today.setFullYear(today.getFullYear() + 1));
            break;
    }

    const settingsData = {
        wordLimit: wordLimitSetting,
        wordDate: targetDate.toISOString().split('T')[0],
        userId: userId
    };

    try {
        const response = await fetch(apiUrl + '/save-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingsData)
        });

        if (response.ok) {
            alert('Ayarlar başarıyla kaydedildi.');
        } else {
            throw new Error('Ayarlar kaydedilirken bir hata oluştu.');
        }
    } catch (error) {
        console.error(error);
        alert('Ayarlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Analiz raporu oluşturma işlevi
async function fetchAnalysisReport() {
    try {
        const response = await fetch(apiUrl + "/get-analysis");
        const data = await response.json();

        const analysisReportDiv = document.getElementById('analysisReport');
        analysisReportDiv.innerHTML = `
            <p>Toplam Kelime Sayısı: ${data.totalWords}</p>
            <p>Başarı Yüzdesi: ${data.successPercentage}%</p>
        `;
    } catch (error) {
        console.error('Analiz raporu alınırken bir hata oluştu:', error);
    }
}

// Sayfa yüklendiğinde analiz raporunu al
window.onload = fetchAnalysisReport;
