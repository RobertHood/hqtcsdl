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

    let query = `SELECT * FROM ??`;
    const queryParams = [tableName];

    if (tableName === "nsx") {
        const filters = [];
        if (req.query.MaNSX) {
            filters.push("MaNSX LIKE ?");
            queryParams.push(`%${req.query.MaNSX}%`);
        }
        if (req.query.name) {
            filters.push("TenNSX LIKE ?");
            queryParams.push(`%${req.query.name}%`);
        }
        if (req.query.country) {
            filters.push("DiaChi LIKE ?");
            queryParams.push(`%${req.query.country}%`);
        }
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(" AND ")}`;
        }
    } else if (tableName === "pc") {
        const filters = [];
        if (req.query.MaSP_P) {
            filters.push("MaSP_P LIKE ?");
            queryParams.push(`%${req.query.MaSP_P}%`);
        }
        if (req.query.CPU) {
            filters.push("CPU LIKE ?");
            queryParams.push(`%${req.query.CPU}%`);
        }
        if (req.query.RAM) {
            filters.push("RAM LIKE ?");
            queryParams.push(`%${req.query.RAM}%`);
        }
        if (req.query.HD) {
            filters.push("HD LIKE ?");
            queryParams.push(`%${req.query.HD}%`);
        }
        if (req.query.Gia) {
            filters.push("Gia LIKE ?");
            queryParams.push(`%${req.query.Gia}%`);
        }
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(" AND ")}`;
        }
    } else if (tableName === "laptop") {
        const filters = [];
        if (req.query.model) {
            filters.push("model LIKE ?");
            queryParams.push(`%${req.query.model}%`);
        }
        if (req.query.cpu) {
            filters.push("cpu LIKE ?");
            queryParams.push(`%${req.query.cpu}%`);
        }
        if (req.query.ram) {
            filters.push("ram LIKE ?");
            queryParams.push(`%${req.query.ram}%`);
        }
        if (req.query.hd) {
            filters.push("hd LIKE ?");
            queryParams.push(`%${req.query.hd}%`);
        }
        if (req.query.manhinh) {
            filters.push("manhinh LIKE ?");
            queryParams.push(`%${req.query.manhinh}%`);
        }
        if (req.query.gia) {
            filters.push("gia LIKE ?");
            queryParams.push(`%${req.query.gia}%`);
        }
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(" AND ")}`;
        }
    } else if (tableName === "sp") {
        const filters = [];
        if (req.query.MaNSX) {
            filters.push("MaNSX LIKE ?");
            queryParams.push(`%${req.query.MaNSX}%`);
        }
        if (req.query.MaSP) {
            filters.push("MaSP LIKE ?");
            queryParams.push(`%${req.query.MaSP}%`);
        }
        if (req.query.loai) {
            filters.push("loai LIKE ?");
            queryParams.push(`%${req.query.loai}%`);
        }
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(" AND ")}`;
        }
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error(`❌ Error fetching data from ${tableName}:`, err.message);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});


app.post("/deleteRow", (req, res) => {
    const { table, idField, idValue } = req.body;

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ success: false, error: "Invalid table name" });
    }

    const query = `DELETE FROM ?? WHERE ?? = ?`;
    const queryParams = [table, idField, idValue];

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error(`❌ Error deleting row from ${table}:`, err.message);
            return res.status(500).json({ success: false, error: "Database query error" });
        }
        res.json({ success: true });
    });
});


app.post("/addData", (req, res) => {
    const { table, data } = req.body;

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ success: false, error: "Invalid table name" });
    }

    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const values = Object.values(data);

    const query = `INSERT INTO ?? (${columns}) VALUES (${placeholders})`;
    const queryParams = [table, ...values];

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error(`❌ Error adding data to ${table}:`, err.message);
            return res.status(500).json({ success: false, error: "Database query error" });
        }
        res.json({ success: true });
    });
});


app.post("/updateRow", (req, res) => {
    const { table, data } = req.body;

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ success: false, error: "Invalid table name" });
    }

    const idField = Object.keys(data)[0]; // Assume the first field is the primary key
    const idValue = data[idField];
    delete data[idField]; // Remove the primary key from the update fields

    const updates = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const values = Object.values(data);

    const query = `UPDATE ?? SET ${updates} WHERE ?? = ?`;
    const queryParams = [table, ...values, idField, idValue];

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error(`❌ Error updating row in ${table}:`, err.message);
            return res.status(500).json({ success: false, error: "Database query error" });
        }
        res.json({ success: true });
    });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
    console.log("🚀 Server running at: http://localhost:3000");
});
