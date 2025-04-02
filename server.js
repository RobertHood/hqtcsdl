const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Boybuster_03",
    database: "th1"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL database.");
    }
});


const allowedTables = ["pc", "nsx", "laptop", "sp"];


app.get("/getData", (req, res) => {
    const tableName = req.query.table;

    if (!tableName) {
        return res.status(400).json({ error: "❌ Table name is required!" });
    }

    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: `❌ Invalid table name: ${tableName}` });
    }

    const query = `SELECT * FROM ??`; // Safe query to prevent SQL injection
    db.query(query, [tableName], (err, results) => {
        if (err) {
            console.error(`❌ Error fetching data from ${tableName}:`, err.message);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Serve index.html as the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")); // Ensure index.html is inside "public"
});

app.listen(3000, () => {
    console.log("🚀 Server running at: http://localhost:3000");
});
