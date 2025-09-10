import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MySQL’ga ulanish
const db = mysql.createConnection({
  host: "mysql.railway.internal",
  user: "root",
  password: "kSUwuBRgUIyFULYpncTQTRvyPFMVwPZX",
  database: "railway" 
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL ulanish xatosi:", err.message);
  } else {
    console.log("✅ MySQL ulandi");
  }
});

// 🔹 1) Barcha todo’larni olish
app.get("/todos/:userId", (req, res) => {
  db.query("SELECT * FROM todos WHERE user_id = ?", [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🔹 Barcha todo’larni olish (userId ga qarab emas)
app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🔹 2) Yangi todo qo‘shish
app.post("/todos", (req, res) => {
  const { user_id, title, importance, date } = req.body;
  db.query("INSERT INTO todos (user_id, title, importance, date) VALUES (?, ?, ?, ?)", [user_id, title, importance, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, user_id, title, importance });
  });
});

// 🔹 3) Todo yangilash
app.put("/todos/:id", (req, res) => {
  const { completed } = req.body;
  db.query("UPDATE todos SET completed = ? WHERE id = ?", [completed, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Todo yangilandi" });
  });
});

// 🔹 4) Todo o‘chirish
app.delete("/todos/:id", (req, res) => {
  db.query("DELETE FROM todos WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Todo o‘chirildi" });
  });
});

app.listen(3000, () => {
  console.log("🚀 Server 3000-portda ishlayapti");
});
