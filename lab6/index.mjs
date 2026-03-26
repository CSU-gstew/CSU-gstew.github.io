import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
    host: "sh4ob67ph9l80v61.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "w9c7lwn8um1o99yj",
    password: "u3rw8lbcasz2h307",
    database: "pyn5h5u7iu857dd2",
    connectionLimit: 10,
    waitForConnections: true
});

app.get('/', async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
               FROM authors
               ORDER BY lastName`;
    const [authors] = await pool.query(sql);
    res.render('home.ejs', { authors });
});

app.get('/searchByAuthor', async (req, res) => {
    try {
        let authorId = req.query.authorId;

        let sql = `SELECT quote, firstName, lastName
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE authorId = ?`;

        let sqlParams = [authorId];

        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotes.ejs', { rows });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.get('/searchByKeyword', async (req, res) => {
    try {
        let keyword = req.query.keyword;

        let sql = `SELECT quote, firstName, lastName
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE quote LIKE ?`;

        let sqlParams = [`%${keyword}%`];

        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotes.ejs', { rows });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.get('/dbTest', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Express server running");
});