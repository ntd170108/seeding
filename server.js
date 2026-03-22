const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cron = require("node-cron");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new sqlite3.Database("./data.db");

db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT,
  time TEXT
)`);

app.post("/post", (req, res) => {
  const content = req.body.content;
  const time = req.body.time;
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
app.get("/", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      return res.send("Lỗi database");
    }

    let list = "";
    if (rows && rows.length > 0) {
      list = rows.map(p => `<li>${p.content} - ${p.time}</li>`).join("");
    }

    res.send(`
      <h2>Seeding Tool</h2>

      <form method="POST" action="/post">
        <input name="content" placeholder="Nội dung" /><br><br>
        <input name="time" type="datetime-local" /><br><br>
        <button type="submit">Đăng</button>
      </form>

      <h3>Bài đã lên lịch:</h3>
      <ul>${list}</ul>
    `);
  });
});
    `);
  });
});
  res.send(`
    <h2>Seeding Tool</h2>
    <form method="POST" action="/post">
      <input name="content" placeholder="Nội dung" /><br><br>
      <input name="time" type="datetime-local" /><br><br>
      <button type="submit">Đăng</button>
    </form>
  `);
});
app.listen(3000, () => console.log("Server chạy"));
