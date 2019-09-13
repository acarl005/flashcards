import express from "express"

const app = express()

app.use("/flashcards", express.static("dist"))

app.get("/", (req, res) => {
  res.redirect(302, "/flashcards")
})

const listener = app.listen(1234, () => {
  const { port } = listener.address()
  console.log(`Listening at http://localhost:${port}`)
})
