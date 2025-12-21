const express = require("express")
const path = require("path")
const db = require("./db")

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "../client")))

app.get("/movies", (req, res) => {
  db.all("SELECT * FROM movies ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ message: "DB-fel" })
    res.json(rows)
  })
})

app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id)
  db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ message: "DB-fel" })
    if (!row) return res.status(404).json({ message: "Hittas inte" })
    res.json(row)
  })
})

app.post("/movies", (req, res) => {
  const title = String(req.body.title || "").trim()
  const year = Number(req.body.year)
  const rating = Number(req.body.rating)
  const color = String(req.body.color || "").trim()

  if (!title || !Number.isFinite(year) || !Number.isFinite(rating) || !color) {
    return res.status(400).json({ message: "Fel data" })
  }

  db.run(
    "INSERT INTO movies (title, year, rating, color) VALUES (?, ?, ?, ?)",
    [title, year, rating, color],
    function (err) {
      if (err) return res.status(500).json({ message: "DB-fel" })
      res.json({ message: "Skapad", id: this.lastID })
    }
  )
})

app.put("/movies", (req, res) => {
  const id = Number(req.body.id)
  const title = String(req.body.title || "").trim()
  const year = Number(req.body.year)
  const rating = Number(req.body.rating)
  const color = String(req.body.color || "").trim()

  if (!Number.isFinite(id) || !title || !Number.isFinite(year) || !Number.isFinite(rating) || !color) {
    return res.status(400).json({ message: "Fel data" })
  }

  db.run(
    "UPDATE movies SET title = ?, year = ?, rating = ?, color = ? WHERE id = ?",
    [title, year, rating, color, id],
    function (err) {
      if (err) return res.status(500).json({ message: "DB-fel" })
      res.json({ message: "Uppdaterad", changes: this.changes })
    }
  )
})

app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id)

  db.run("DELETE FROM movies WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ message: "DB-fel" })
    res.json({ message: "Borttagen", changes: this.changes })
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server kör på http://localhost:${PORT}`)
})
