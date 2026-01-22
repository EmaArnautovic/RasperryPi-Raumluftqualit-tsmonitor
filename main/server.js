const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile('index.html')
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'roomairquality',
    port: 3306,
});

connection.connect((err) => {
    if (err) {
    console.error('Fehler bei der Verbindung zur MySQL-Datenbank: ' + err.stack);
    return;}
    console.log('Erfolgreich mit der MySQL-Datenbank verbunden'); });

// Example endpoint to fetch data from the database
app.get('/api/data', (req, res) => {
    // Use the connection pool to query the database
    connection.query('SELECT * FROM measurments', (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
