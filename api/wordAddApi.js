const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 3002;
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "wordImage") {
      cb(null, path.join(__dirname, "gorseller"));
    } else if (file.fieldname === "wordAudio") {
      cb(null, path.join(__dirname, "sesler"));
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

app.post(
  "/addWord",
  upload.fields([
    { name: "wordImage", maxCount: 1 },
    { name: "wordAudio", maxCount: 1 },
  ]),
  (req, res) => {
    const { wordMeaning, word, wordSentence, userId } = req.body;

    // İlk olarak kelimeyi veritabanına ekleyip word_id değerini alıyoruz
    const query =
      "INSERT INTO words (word_meaning, word, word_in_sentence) VALUES (?, ?, ?)";
    const values = [wordMeaning, word, wordSentence];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Kelime eklenirken bir hata oluştu:", err);
        return res.status(500).send("Kelime eklenirken bir hata oluştu.");
      }

      const wordId = result.insertId; // Eklenen kelimenin word_id değeri

      // Dosya adlarını word_id ile oluştur
      const gorselDosyaAdi = `gorsel${wordId}.jpg`;
      const sesDosyaAdi = `ses${wordId}.mp3`;

      // Dosyaları doğru konumlara yeniden adlandırarak kaydet
      const oldImagePath = req.files.wordImage[0].path;
      const oldAudioPath = req.files.wordAudio[0].path;

      const newImagePath = path.join(__dirname, "gorseller", gorselDosyaAdi);
      const newAudioPath = path.join(__dirname, "sesler", sesDosyaAdi);

      fs.rename(oldImagePath, newImagePath, (err) => {
        if (err) {
          console.error(
            "Görsel dosya yeniden adlandırılırken hata oluştu:",
            err
          );
          return res
            .status(500)
            .send("Görsel dosya yeniden adlandırılırken hata oluştu.");
        }

        fs.rename(oldAudioPath, newAudioPath, (err) => {
          if (err) {
            console.error(
              "Ses dosyası yeniden adlandırılırken hata oluştu:",
              err
            );
            return res
              .status(500)
              .send("Ses dosyası yeniden adlandırılırken hata oluştu.");
          }

          // Relative dosya yollarını belirleyelim
          const relativeImagePath = path.join(
            "/api",
            "gorseller",
            gorselDosyaAdi
          );
          const relativeAudioPath = path.join("/api", "sesler", sesDosyaAdi);

          // Dosya adlarını güncellemek için veritabanı sorgusu
          const updateQuery =
            "UPDATE words SET word_image = ?, word_voice = ? WHERE word_id = ?";
          const updateValues = [relativeImagePath, relativeAudioPath, wordId];

          db.query(updateQuery, updateValues, (err) => {
            if (err) {
              console.error("Dosya adları güncellenirken hata oluştu:", err);
              return res
                .status(500)
                .send("Dosya adları güncellenirken hata oluştu.");
            }

            const today = new Date().toISOString().split("T")[0];
            const next_quiz_date = today;
            const how_many_times_asked = 0;
            const how_many_wrong_answers = 0;
            const how_many_correct_answers = 0;

            // worddetails tablosuna yeni kayıt ekleme
            const wordDetailsQuery =
              "INSERT INTO worddetails (user_id, word_id, word_counter,next_quiz_date,how_many_times_asked,how_many_wrong_answers,how_many_correct_answers) VALUES (?, ?, 0, ?, ?, ?, ?)";
            const wordDetailsValues = [
              userId,
              wordId,
              next_quiz_date,
              how_many_times_asked,
              how_many_wrong_answers,
              how_many_correct_answers,
            ];

            db.query(wordDetailsQuery, wordDetailsValues, (err) => {
              if (err) {
                console.error("Word details eklenirken hata oluştu:", err);
                return res
                  .status(500)
                  .send("Word details eklenirken hata oluştu.");
              }

              res.status(201).send("Kelime ve detaylar başarıyla eklendi.");
            });
          });
        });
      });
    });
  }
);

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
