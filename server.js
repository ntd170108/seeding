const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cron = require("node-cron");

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database("./data.db");

db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT,
  time TEXT
)`);

app.post("/post", (req, res) => {
  const { content, time } = req.body;
  db.run("INSERT INTO posts (content, time) VALUES (?, ?)", [content, time]);
  res.send("Đã lưu");
});

cron.schedule("* * * * *", () => {
  const now = new Date().toISOString().slice(0,16);
  db.all("SELECT * FROM posts WHERE time = ?", [now], (err, rows) => {
    rows.forEach(post => {
      console.log("Đăng:", post.content);
    });
  });
});

app.listen(3000, () => console.log("Server chạy"));
