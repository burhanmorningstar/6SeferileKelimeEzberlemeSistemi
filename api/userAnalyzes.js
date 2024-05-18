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

    const query = 'SELECT * FROM settings WHERE user_id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Ayarlar alınırken bir hata oluştu:', err);
            return res.status(500).send('Ayarlar alınırken bir hata oluştu.');
        }

        if (result.length > 0) {
            // Kullanıcıya ait ayarlar zaten var, güncelleme yap
            const updateQuery = 'UPDATE settings SET word_limit = ?, next_ask_date = ? WHERE user_id = ?';
            db.query(updateQuery, [wordLimit, wordDate, userId], (err, result) => {
                if (err) {
                    console.error('Ayarlar güncellenirken bir hata oluştu:', err);
                    return res.status(500).send('Ayarlar güncellenirken bir hata oluştu.');
                }
                res.status(200).send('Ayarlar başarıyla güncellendi.');
            });
        } else {
            // Kullanıcıya ait ayarlar yok, ekle
            const insertQuery = 'INSERT INTO settings (user_id, word_limit, next_ask_date) VALUES (?, ?, ?)';
            db.query(insertQuery, [userId, wordLimit, wordDate], (err, result) => {
                if (err) {
                    console.error('Ayarlar eklenirken bir hata oluştu:', err);
                    return res.status(500).send('Ayarlar eklenirken bir hata oluştu.');
                }
                res.status(200).send('Ayarlar başarıyla eklendi.');
            });
        }
    });
});



app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
