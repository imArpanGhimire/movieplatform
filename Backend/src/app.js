const express = require("express")
const app = express()

app.use(express.json())

const authroutes = require("./routes/auth.routes")

app.use("/api/auth", authroutes)

module.exports = app