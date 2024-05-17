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

app.get("/questions/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Kullanıcının word_limit değerini al
    db.query(
      "SELECT word_limit FROM settings WHERE user_id = ?",
      [userId],
      (error, settingsResult) => {
        if (error) {
          console.error("Error fetching settings:", error);
          res.status(500).json({ message: "Internal Server Error" });
          return;
        }

        // Kullanıcıya ait word_limit değerini al
        const wordLimit =
          settingsResult.length > 0 ? settingsResult[0].word_limit : 10;

        // Rastgele bir kelime seç
        const query = `
        SELECT w.*, wd.word_counter, wd.user_id
        FROM words AS w
        INNER JOIN worddetails AS wd ON w.word_id = wd.word_id
        WHERE wd.user_id = ? AND wd.word_counter < 6
        ORDER BY RAND()
        LIMIT ?;
      `;
        db.query(query, [userId, wordLimit], (error, results) => {
          if (error) {
            console.error("Error fetching questions:", error);
            res.status(500).json({ message: "Internal Server Error" });
            return;
          }
          res.json(results);
        });
      }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/answer", async (req, res) => {
  try {
    const { userId, wordId, answer } = req.body;

    // MySQL sorgusu: Verilen wordId'ye ait kelimenin doğru cevabını al
    const selectQuery = `
      SELECT word_meaning FROM words WHERE word_id = ?
    `;
    db.query(selectQuery, [wordId], (error, results) => {
      if (error) {
        console.error("Error fetching correct answer:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }

      const correctAnswer = results[0].word_meaning;

      // Kullanıcının cevabı ile doğru cevabı karşılaştır
      if (answer === correctAnswer) {
        // Doğru cevaplanmış ise word_counter değerini arttır
        db.query(
          "UPDATE worddetails SET word_counter = word_counter + 1 WHERE user_id = ? AND word_id = ?",
          [userId, wordId],
          (error, updateResult) => {
            if (error) {
              console.error("Error updating word_counter:", error);
              res.status(500).json({ message: "Internal Server Error" });
              return;
            }
            console.log("Correct answer!");
            res.json({ message: "Correct answer!" });
          }
        );
      } else {
        // Yanlış cevaplanmış ise word_counter değerini sıfırla
        db.query(
          "UPDATE worddetails SET word_counter = 0 WHERE user_id = ? AND word_id = ?",
          [userId, wordId],
          (error, updateResult) => {
            if (error) {
              console.error("Error updating word_counter:", error);
              res.status(500).json({ message: "Internal Server Error" });
              return;
            }
            res.json({ message: "Incorrect answer." });
          }
        );
      }
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

function addDefaultSettings(userId) {
  // Kullanıcının worddetails tablosunda kaydı var mı kontrol et
  db.query(
    "SELECT * FROM worddetails WHERE user_id = ?",
    userId,
    (err, result) => {
      if (err) {
        console.error("Word details alınırken bir hata oluştu:", err);
        return;
      }

      // Eğer kullanıcının zaten kaydı varsa, yeni kayıt ekleme
      if (result.length > 0) {
        console.log(
          "Kullanıcının worddetails tablosunda zaten kaydı bulunmaktadır."
        );
        return;
      }

      db.query("SELECT COUNT(*) AS total FROM words", (err, result) => {
        if (err) {
          console.error("Kelime sayısı alınırken bir hata oluştu:", err);
          return;
        }

        const totalWords = result[0].total;

        // Her kelime için ayar ekle
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
      });
    }
  );
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
