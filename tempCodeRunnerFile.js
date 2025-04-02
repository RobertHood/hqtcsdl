const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow frontend to access backend
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Change if necessary
    password: "Boybuster_03", // Change if necessary
    database: "th1"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to MySQL database.");
    }
});

app.get("/getData", (req, res) => {
    db.query("SELECT * FROM nsx", (err, results) => {
        if (err) {
            console.error("Error fetching data:", err.message);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});




