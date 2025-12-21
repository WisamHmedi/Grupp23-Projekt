const msgBox = document.getElementById("msg")
const listArea = document.getElementById("listArea")

const form = document.getElementById("movieForm")
const clearBtn = document.getElementById("clearBtn")

const editId = document.getElementById("editId")
const titleEl = document.getElementById("title")
const yearEl = document.getElementById("year")
const ratingEl = document.getElementById("rating")
const colorEl = document.getElementById("color")

function showMsg(text, type = "success") {
  msgBox.className = `alert alert-${type}`
  msgBox.textContent = text
  msgBox.classList.remove("d-none")
  setTimeout(() => msgBox.classList.add("d-none"), 2000)
}

function resetForm() {
  editId.value = ""
  form.reset()
}

async function fetchAll() {
  const res = await fetch("/movies")
  return res.json()
}

async function fetchOne(id) {
  const res = await fetch(`/movies/${id}`)
  return res.json()
}

async function createMovie(payload) {
  const res = await fetch("/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}

async function updateMovie(payload) {
  const res = await fetch("/movies", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return res.json()
}

async function deleteMovie(id) {
  const res = await fetch(`/movies/${id}`, { method: "DELETE" })
  return res.json()
}

function renderList(items) {
  const wrap = document.createElement("div")
  wrap.className = "row g-2"

  items.forEach((m) => {
    const col = document.createElement("div")
    col.className = "col-12 col-md-6"

    const card = document.createElement("div")
    card.className = "card p-3"
    card.style.borderLeft = `10px solid ${m.color}`

    const title = document.createElement("div")
    title.className = "fw-bold"
    title.textContent = m.title

    const sub = document.createElement("div")
    sub.className = "text-muted"
    sub.textContent = `År ${m.year}  Betyg ${m.rating}/10`

    const actions = document.createElement("div")
    actions.className = "mt-2 d-flex gap-2"

    const editBtn = document.createElement("button")
    editBtn.className = "btn btn-outline-secondary btn-sm"
    editBtn.textContent = "Ändra"
    editBtn.addEventListener("click", async () => {
      const data = await fetchOne(m.id)
      editId.value = data.id
      titleEl.value = data.title
      yearEl.value = data.year
      ratingEl.value = data.rating
      colorEl.value = data.color
      showMsg("Formuläret är fyllt", "info")
    })

    const delBtn = document.createElement("button")
    delBtn.className = "btn btn-outline-danger btn-sm"
    delBtn.textContent = "Ta bort"
    delBtn.addEventListener("click", async () => {
      const data = await deleteMovie(m.id)
      showMsg(data.message)
      refresh()
    })

    actions.append(editBtn, delBtn)
    card.append(title, sub, actions)
    col.append(card)
    wrap.append(col)
  })

  listArea.innerHTML = ""
  listArea.append(wrap)
}

async function refresh() {
  const items = await fetchAll()
  renderList(items)
}

clearBtn.addEventListener("click", () => {
  resetForm()
  showMsg("Rensad", "info")
})

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const payload = {
    title: titleEl.value.trim(),
    year: Number(yearEl.value),
    rating: Number(ratingEl.value),
    color: colorEl.value.trim()
  }

  if (editId.value) {
    payload.id = Number(editId.value)
    const data = await updateMovie(payload)
    showMsg(data.message)
  } else {
    const data = await createMovie(payload)
    showMsg(data.message)
  }

  resetForm()
  refresh()
})

refresh()
