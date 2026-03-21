const express = require("express")
const app = express()
const authroutes = require("./routes/auth.routes")
const movieroutes = require("./routes/movie.routes")
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authroutes)
app.use("/api/movie", movieroutes)


module.exports = app