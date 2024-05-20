const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3003;
app.use(cors());

// MySQL bağlantısı
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "6kelimetekrar",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Bağlandı...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ayarları kaydetme
app.post("/save-settings", (req, res) => {
  const { wordLimit, userId } = req.body;

  const query = "SELECT * FROM settings WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Ayarlar alınırken bir hata oluştu:", err);
      return res.status(500).send("Ayarlar alınırken bir hata oluştu.");
    }

    if (result.length > 0) {
      // Kullanıcıya ait ayarlar zaten var, güncelleme yap
      const updateQuery =
        "UPDATE settings SET word_limit = ? WHERE user_id = ?";
      db.query(updateQuery, [wordLimit, userId], (err, result) => {
        if (err) {
          console.error("Ayarlar güncellenirken bir hata oluştu:", err);
          return res
            .status(500)
            .send("Ayarlar güncellenirken bir hata oluştu.");
        }
        res.status(200).send("Ayarlar başarıyla güncellendi.");
      });
    } else {
      // Kullanıcıya ait ayarlar yok, ekle
      const insertQuery =
        "INSERT INTO settings (user_id, word_limit) VALUES (?, ?)";
      db.query(insertQuery, [userId, wordLimit], (err, result) => {
        if (err) {
          console.error("Ayarlar eklenirken bir hata oluştu:", err);
          return res.status(500).send("Ayarlar eklenirken bir hata oluştu.");
        }
        res.status(200).send("Ayarlar başarıyla eklendi.");
      });
    }
  });
});

app.get('/get-analysis', (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ message: "user_id is required" });
  }

  const query = `
    SELECT 
      w.word,
      wd.word_counter, wd.how_many_times_asked, wd.how_many_wrong_answers, wd.how_many_correct_answers
    FROM words AS w
    JOIN wordDetails AS wd ON w.word_id = wd.word_id
    WHERE wd.user_id = ?
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching analysis:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    const totalAsked = results.reduce((acc, word) => acc + word.how_many_times_asked, 0);
    const totalWords = results.length;
    const wrongAnswers = results.reduce((acc, word) => acc + word.how_many_wrong_answers, 0);
    const correctAnswers = results.reduce((acc, word) => acc + word.how_many_correct_answers, 0);
    const successPercentage = totalAsked ? ((correctAnswers / (correctAnswers + wrongAnswers)) * 100).toFixed(2) : 0;

    res.json({
      totalWords,
      successPercentage,
      words: results,
      totalWrong : wrongAnswers,
      totalCorrect : correctAnswers,
      totalAsked : totalAsked,
    });
  });
});


app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
