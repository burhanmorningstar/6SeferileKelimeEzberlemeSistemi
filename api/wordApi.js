// wordApi.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL bağlantısı için gereken bilgiler
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: '6kelimetekrar'
});

// MySQL bağlantısını sağla
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Kelimeleri döndüren endpoint
app.get('/questions', async (req, res) => {
  try {
    // MySQL sorgusu: Word tablosundan bütün kelimeleri ve ilgili detayları getir
    const query = `
    SELECT w.*, wd.word_counter, wd.user_id
FROM words AS w
LEFT JOIN wordDetails AS wd ON w.word_id = wd.word_id
LEFT JOIN settings AS s ON wd.user_id = s.user_id
WHERE wd.word_counter < 6 AND wd.user_id = '4'
AND s.next_ask_date <= CURDATE()
LIMIT 10;
    
    `;

    const { userId, wordLimit } = req.query;
    connection.query(query, [userId, wordLimit], (error, results) => {
      if (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Cevap kontrolü için endpoint
app.post('/answer', async (req, res) => {
  try {
    const { userId, wordId, answer } = req.body;

    // MySQL sorgusu: KnownWords tablosuna kullanıcının cevabını ekle
    const insertQuery = `
      INSERT INTO knownWords (user_id, word_id, last_asked_date, next_ask_date)
      VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY))
      ON DUPLICATE KEY UPDATE
      last_asked_date = VALUES(last_asked_date),
      next_ask_date = CASE WHEN VALUES(next_ask_date) <= CURDATE() THEN DATE_ADD(CURDATE(), INTERVAL 1 DAY) ELSE VALUES(next_ask_date) END;
    `;
    connection.query(insertQuery, [userId, wordId], (error, results) => {
      if (error) {
        console.error('Error inserting answer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Answer checked successfully.' });
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Kullanıcı ayarlarını güncelleme için endpoint
app.put('/settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { wordLimit, nextAskDate } = req.body;

    // MySQL sorgusu: Kullanıcının ayarlarını güncelle
    const updateQuery = `
      INSERT INTO settings (user_id, word_limit, next_ask_date)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      word_limit = VALUES(word_limit),
      next_ask_date = VALUES(next_ask_date);
    `;
    connection.query(updateQuery, [userId, wordLimit, nextAskDate], (error, results) => {
      if (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Settings updated successfully.' });
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Sunucuyu belirtilen portta çalıştır
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
