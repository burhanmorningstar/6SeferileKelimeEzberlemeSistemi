const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

// Function to add words to the database
function addWords(words) {
    // Connect to the database
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database: ', err);
            return;
        }
        console.log('Connected to the database');

        // Insert each word into the database
        words.forEach((word) => {
            const sql = 'INSERT INTO words (word) VALUES (?)';
            connection.query(sql, [word], (err, result) => {
                if (err) {
                    console.error('Error inserting word: ', err);
                    return;
                }
                console.log('Word inserted successfully');
            });
        });

        // Close the database connection
        connection.end((err) => {
            if (err) {
                console.error('Error closing the database connection: ', err);
                return;
            }
            console.log('Database connection closed');
        });
    });
}
  
// Express.js route handler for adding words to the database
app.post('/wordAdd', (req, res) => {
    const wordsToAdd = req.body.words; // Assuming the words are sent in the request body as an array

    // Call the addWords function to insert the words into the database
    addWords(wordsToAdd);

    // Send a response indicating success
    res.status(200).json({ message: 'Words added successfully' });
});