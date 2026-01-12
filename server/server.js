const express = require("express")
const path = require("path")
const db = require("./db")

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "../Client")))

app.get("/games", (req, res) => {
  db.all("SELECT * FROM games ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ message: "DB-fel" })
    res.json(rows)
  })
})

app.get("/games/:id", (req, res) => {
  const id = Number(req.params.id)
  db.get("SELECT * FROM games WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ message: "DB-fel" })
    if (!row) return res.status(404).json({ message: "Hittas inte" })
    res.json(row)
  })
})

app.post("/games", (req, res) => {
  const name = String(req.body.name || "").trim()
  const platform = String(req.body.platform || "").trim()
  const rating = Number(req.body.rating)
  const color = String(req.body.color || "").trim()

  if (!name || !platform || !Number.isFinite(rating) || !color) {
    return res.status(400).json({ message: "Fel data" })
  }

  db.run(
    "INSERT INTO games (name, platform, rating, color) VALUES (?, ?, ?, ?)",
    [name, platform, rating, color],
    function (err) {
      if (err) return res.status(500).json({ message: "DB-fel" })
      res.json({ message: "Skapad", id: this.lastID })
    }
  )
})

app.put("/games", (req, res) => {
  const id = Number(req.body.id)
  const name = String(req.body.name || "").trim()
  const platform = String(req.body.platform || "").trim()
  const rating = Number(req.body.rating)
  const color = String(req.body.color || "").trim()

  if (!Number.isFinite(id) || !name || !platform || !Number.isFinite(rating) || !color) {
    return res.status(400).json({ message: "Fel data" })
  }

  db.run(
    "UPDATE games SET name = ?, platform = ?, rating = ?, color = ? WHERE id = ?",
    [name, platform, rating, color, id],
    function (err) {
      if (err) return res.status(500).json({ message: "DB-fel" })
      res.json({ message: "Uppdaterad", changes: this.changes })
    }
  )
})

app.delete("/games/:id", (req, res) => {
  const id = Number(req.params.id)

  db.run("DELETE FROM games WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ message: "DB-fel" })
    res.json({ message: "Borttagen", changes: this.changes })
  })
})

const PORT = 3000
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`))
