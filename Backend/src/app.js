const express = require("express")
const app = express()
const authroutes = require("./routes/auth.routes")
const movieroutes = require("./routes/movie.routes")

app.use(express.json())

app.use("/api/auth", authroutes)
app.use("/api/movie", movieroutes)


module.exports = app