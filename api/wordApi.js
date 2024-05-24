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

        // Kullanıcının tekrarlanması gereken kelimelerini getir
        const query = `
          SELECT w.*, wd.word_counter, wd.user_id, wd.next_quiz_date
          FROM words AS w
          INNER JOIN wordDetails AS wd ON w.word_id = wd.word_id
          WHERE wd.user_id = ? AND wd.word_counter < 6 AND wd.next_quiz_date <= CURDATE()
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

      if (results.length === 0) {
        res.status(404).json({ message: "Word not found" });
        return;
      }

      const correctAnswer = results[0].word_meaning;

      // Kullanıcının cevabı ile doğru cevabı karşılaştır
      if (answer === correctAnswer) {
        // Doğru cevaplanmış ise word_counter, how_many_times_asked değerlerini arttır ve last_asked_date güncelle
        const today = new Date();

        let nextQuizDate;
        const getNextQuizDate = (level) => {
          switch (level) {
            case 0:
              return new Date(today.setDate(today.getDate() + 1));
            case 1:
              return new Date(today.setDate(today.getDate() + 7));
            case 2:
              return new Date(today.setMonth(today.getMonth() + 1));
            case 3:
              return new Date(today.setMonth(today.getMonth() + 3));
            case 4:
              return new Date(today.setMonth(today.getMonth() + 6));
            case 5:
              return new Date(today.setFullYear(today.getFullYear() + 1));
            default:
              return today;
          }
        };

        const updateQuery = `
          UPDATE wordDetails 
          SET 
            word_counter = word_counter + 1, 
            how_many_times_asked = how_many_times_asked + 1,
            how_many_correct_answers = how_many_correct_answers + 1, 
            last_asked_date = ?,
            next_quiz_date = ?
          WHERE user_id = ? AND word_id = ?
        `;

        db.query(
          `SELECT word_counter FROM wordDetails WHERE user_id = ? AND word_id = ?`,
          [userId, wordId],
          (err, result) => {
            if (err) {
              console.error("Error fetching word counter:", err);
              res.status(500).json({ message: "Internal Server Error" });
              return;
            }

            const currentLevel = result[0].word_counter;
            nextQuizDate = getNextQuizDate(currentLevel);

            db.query(
              updateQuery,
              [
                today.toISOString().split("T")[0],
                nextQuizDate.toISOString().split("T")[0],
                userId,
                wordId,
              ],
              (error) => {
                if (error) {
                  console.error("Error updating word details:", error);
                  res.status(500).json({ message: "Internal Server Error" });
                  return;
                }
                console.log("Correct answer!");
                res.json({ message: "Correct answer!" });
              }
            );
            // MySQL sorgusu: word_counter kontrolü
            db.query(
              `SELECT word_counter FROM wordDetails WHERE user_id = ? AND word_id = ?`,
              [userId, wordId],
              (err, result) => {
                if (err) {
                  console.error("Error fetching word counter:", err);
                  res.status(500).json({ message: "Internal Server Error" });
                  return;
                }

                const wordCounter = result[0].word_counter;

                if (wordCounter > 6) {
                  // word_counter > 6 ise kelimeyi knownwords tablosuna ekle
                  const insertQuery = `
            INSERT INTO knownwords (user_id, word_id, last_asked_date)
            VALUES (?, ?, ?)
          `;
                  db.query(
                    insertQuery,
                    [userId, wordId, new Date().toISOString().split("T")[0]],
                    (error) => {
                      if (error) {
                        console.error(
                          "Error inserting word into knownwords:",
                          error
                        );
                        res
                          .status(500)
                          .json({ message: "Internal Server Error" });
                        return;
                      }
                      console.log("Word added to knownwords table");
                    }
                  );
                }
              }
            );
          }
        );
      } else {
        // Yanlış cevaplanmış ise word_counter değerini sıfırla ve how_many_wrong_answers değerini arttır
        const updateQuery = `
          UPDATE wordDetails 
          SET 
            word_counter = 0, 
            how_many_wrong_answers = how_many_wrong_answers + 1,
            how_many_times_asked = how_many_times_asked + 1
          WHERE user_id = ? AND word_id = ?
        `;
        db.query(updateQuery, [userId, wordId], (error) => {
          if (error) {
            console.error("Error updating word details:", error);
            res.status(500).json({ message: "Internal Server Error" });
            return;
          }
          res.json({ message: "Incorrect answer." });
        });
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
        const today = new Date().toISOString().split("T")[0];

        const totalWords = result[0].total;

        // Her kelime için ayar ekle
        for (let i = 1; i <= totalWords; i++) {
          const wordDetails = {
            word_counter: 0,
            user_id: userId,
            word_id: i,
            next_quiz_date: today,
            how_many_times_asked: 0,
            how_many_wrong_answers: 0,
            how_many_correct_answers: 0,
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
          res
            .status(200)
            .json({ message: "Varsayılan ayarlar başarıyla eklendi." });
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
