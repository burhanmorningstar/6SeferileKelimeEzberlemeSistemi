// wordApi.js

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL bağlantısı için gereken bilgiler
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "6kelimetekrar",
});

// MySQL bağlantısını sağla
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Kelimeleri döndüren endpoint
app.get("/questions", async (req, res) => {
  try {
    // MySQL sorgusu: Word tablosundan bütün kelimeleri ve ilgili detayları getir
    const userId = req.params.userId;
    const query = `
    SELECT w.*, wd.word_counter, wd.user_id
FROM words AS w
LEFT JOIN worddetails AS wd ON w.word_id = wd.word_id
LEFT JOIN settings AS s ON wd.user_id = s.user_id
WHERE wd.word_counter < 6 
AND wd.user_id = '${userId}'
AND s.next_ask_date <= CURDATE()
AND w.word_id IN (
    SELECT word_id 
    FROM worddetails 
    WHERE user_id = '${userId}' AND word_counter < (SELECT word_limit FROM settings WHERE user_id = '${userId}')
);

`;
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error fetching words:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
      res.status(200).json("başarılı:",results);
    });
  } catch (error) {
    console.error("Error fetching words:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Cevap kontrolü için endpoint
app.post("/answer", async (req, res) => {
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
    db.query(insertQuery, [userId, wordId], (error, results) => {
      if (error) {
        console.error("Error inserting answer:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
      res.json({ message: "Answer checked successfully." });
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Kullanıcı kaydolduğunda varsayılan ayarları eklemek için fonksiyon
function addDefaultSettings(userId) {
  const defaultSettings = {
    word_counter: 0,
    word_limit: 10,
    next_ask_date: "2024-05-01", // next_ask_date değeri 1 Mayıs 2024 olarak ayarlandı
  };
  db.query(
    "INSERT INTO settings SET ?",
    { user_id: userId, ...defaultSettings },
    (err, result) => {
      if (err) {
        console.error("Varsayılan ayarlar eklenirken bir hata oluştu:", err);
      } else {
        console.log(
          "Kullanıcı için varsayılan ayarlar başarıyla eklendi:",
          userId
        );
      }
    }
  );

  // Mevcut kelimelerin sayısına göre worddetails tablosuna kayıt ekleme
  db.query("SELECT COUNT(*) AS total FROM words", (err, result) => {
    if (err) {
      console.error("Kelime sayısı alınırken bir hata oluştu:", err);
    } else {
      const totalWords = result[0].total;
      for (let i = 1; i <= totalWords; i++) {
        const wordDetails = {
          word_counter: 0,
          user_id: userId,
          word_id: i,
        };
        db.query(
          "INSERT INTO worddetails SET ?",
          wordDetails,
          (err, result) => {
            if (err) {
              console.error("Word details eklenirken bir hata oluştu:", err);
            } else {
              console.log("Word details başarıyla eklendi:", result.insertId);
            }
          }
        );
      }
    }
  });
}

// Kullanıcının ayarlarını almak için endpoint
app.get("/settings/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM settings WHERE user_id = ?",
    userId,
    (err, result) => {
      if (err) {
        console.error("Kullanıcı ayarları alınırken bir hata oluştu:", err);
        res.status(500).send("Kullanıcı ayarları alınırken bir hata oluştu");
      } else {
        if (result.length === 0) {
          // Eğer kullanıcıya ait ayarlar bulunamazsa varsayılan ayarları ekleyin
          addDefaultSettings(userId);
          // Varsayılan ayarları gönderin
          res.status(200).json({
            word_counter: 0,
            word_limit: 10,
            next_ask_date: "2024-05-01", // next_ask_date değeri 1 Mayıs 2024 olarak ayarlandı
          });
        } else {
          // Kullanıcının ayarlarını gönderin
          res.status(200).json(result[0]);
        }
      }
    }
  );
});

// Sunucuyu belirtilen portta çalıştır
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
