const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3003;
app.use(cors());

// MySQL bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: '6kelimetekrar'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Bağlandı...');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ayarları kaydetme
app.post('/save-settings', (req, res) => {
    const { wordLimit, wordDate, userId } = req.body;

    const query = 'UPDATE settings SET word_limit = ?, next_ask_date = ? WHERE user_id = ?';
    db.query(query, [wordLimit, wordDate, userId], (err, result) => {
        if (err) {
            console.error('Ayarlar kaydedilirken bir hata oluştu:', err);
            return res.status(500).send('Ayarlar kaydedilirken bir hata oluştu.');
        }
        res.status(200).send('Ayarlar başarıyla kaydedildi.');
    });
});

// Analiz raporu alma
app.get('/get-analysis', (req, res) => {
    const query = `
        SELECT COUNT(*) as totalWords,
               SUM(success) / COUNT(*) * 100 as successPercentage
        FROM words
        WHERE user_id = 1
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Analiz raporu alınırken bir hata oluştu:', err);
            return res.status(500).send('Analiz raporu alınırken bir hata oluştu.');
        }
        res.status(200).json(result[0]);
    });
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
