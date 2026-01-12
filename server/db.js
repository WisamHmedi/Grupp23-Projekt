const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const dbPath = path.join(__dirname, "app.db")
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("DB öppningsfel", err)
  } else {
    console.log("DB öppnad")
  }
})

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      platform TEXT NOT NULL,
      rating INTEGER NOT NULL,
      color TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.log("TABELL FEL", err)
    } else {
      console.log("TABELL OK")
    }
  })
})

module.exports = db
