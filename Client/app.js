const listArea = document.getElementById("listArea")
const countEl = document.getElementById("count")

const form = document.getElementById("gameForm")
const clearBtn = document.getElementById("clearBtn")
const searchEl = document.getElementById("search")

const editId = document.getElementById("editId")
const nameEl = document.getElementById("name")
const platformEl = document.getElementById("platform")
const ratingEl = document.getElementById("rating")
const colorEl = document.getElementById("color")

const toastEl = document.getElementById("toast")
const toastBody = document.getElementById("toastBody")
const toast = new bootstrap.Toast(toastEl, { delay: 1800 })

let allGames = []

function showToast(text) {
  toastBody.textContent = text
  toast.show()
}

function resetForm() {
  editId.value = ""
  form.reset()
}

async function apiGetAll() {
  const res = await fetch("/games")
  return res.json()
}

async function apiGetOne(id) {
  const res = await fetch(`/games/${id}`)
  return res.json()
}

async function apiCreate(payload) {
  const res = await fetch("/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}

async function apiUpdate(payload) {
  const res = await fetch("/games", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}

async function apiDelete(id) {
  const res = await fetch(`/games/${id}`, { method: "DELETE" })
  return res.json()
}

function matchesSearch(game, q) {
  if (!q) return true
  const s = q.toLowerCase()
  return game.name.toLowerCase().includes(s) || game.platform.toLowerCase().includes(s)
}

function ratingBadge(rating) {
  if (rating >= 8) return "bg-success"
  if (rating >= 5) return "bg-warning text-dark"
  return "bg-danger"
}

function renderList() {
  const q = searchEl.value.trim()
  const items = allGames.filter(g => matchesSearch(g, q))

  countEl.textContent = `${items.length} spel`

  listArea.innerHTML = ""

  items.forEach((g) => {
    const col = document.createElement("div")
    col.className = "col-12 col-md-6"

    const card = document.createElement("div")
    card.className = "card shadow-sm h-100"
    card.style.borderLeft = `10px solid ${g.color}`

    const body = document.createElement("div")
    body.className = "card-body"

    const top = document.createElement("div")
    top.className = "d-flex align-items-start justify-content-between gap-2"

    const title = document.createElement("div")
    title.className = "fw-semibold"
    title.textContent = g.name

    const badge = document.createElement("span")
    badge.className = `badge ${ratingBadge(g.rating)}`
    badge.textContent = `${g.rating}/10`

    top.append(title, badge)

    const meta = document.createElement("div")
    meta.className = "text-muted small mt-1"
    meta.textContent = g.platform

    const actions = document.createElement("div")
    actions.className = "mt-3 d-flex gap-2"

    const editBtn = document.createElement("button")
    editBtn.className = "btn btn-outline-secondary btn-sm"
    editBtn.textContent = "Ändra"
    editBtn.addEventListener("click", async () => {
      const data = await apiGetOne(g.id)
      editId.value = data.id
      nameEl.value = data.name
      platformEl.value = data.platform
      ratingEl.value = data.rating
      colorEl.value = data.color
      showToast("Formuläret är fyllt")
    })

    const delBtn = document.createElement("button")
    delBtn.className = "btn btn-outline-danger btn-sm"
    delBtn.textContent = "Ta bort"
    delBtn.addEventListener("click", async () => {
      const data = await apiDelete(g.id)
      showToast(data.message)
      await refresh()
    })

    actions.append(editBtn, delBtn)

    body.append(top, meta, actions)
    card.append(body)
    col.append(card)
    listArea.append(col)
  })
}

async function refresh() {
  allGames = await apiGetAll()
  renderList()
}

clearBtn.addEventListener("click", () => {
  resetForm()
  showToast("Rensad")
})

searchEl.addEventListener("input", () => {
  renderList()
})

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const payload = {
    name: nameEl.value.trim(),
    platform: platformEl.value.trim(),
    rating: Number(ratingEl.value),
    color: colorEl.value.trim()
  }

  if (editId.value) {
    payload.id = Number(editId.value)
    const data = await apiUpdate(payload)
    showToast(data.message)
  } else {
    const data = await apiCreate(payload)
    showToast(data.message)
  }

  resetForm()
  await refresh()
})

refresh()
