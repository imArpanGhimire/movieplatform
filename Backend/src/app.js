const express = require("express")
const app = express()
const authroutes = require("./routes/auth.routes")
const movieroutes = require("./routes/movie.routes")
const likesroutes = require("./routes/likes.routes")

const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
)

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authroutes)
app.use("/api/movie", movieroutes)
app.use("/api/toggle", likesroutes)
app.use("/api/reply", replyRoutes);

module.exports = app