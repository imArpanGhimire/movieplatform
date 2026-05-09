const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authroutes = require("./routes/auth.routes");
const movieroutes = require("./routes/movie.routes");
const likesroutes = require("./routes/likes.routes");
const replyRoutes = require("./routes/reply.routes");
const tmdbRoutes = require("./routes/tmdb.routes");
const savedRoutes = require("./routes/saved.routes");
const personalizedRoutes = require("./routes/personalized.routes");
const battleRoutes = require("./routes/battle.routes");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authroutes);
app.use("/api/movie", movieroutes);
app.use("/api/toggle", likesroutes);
app.use("/api/reply", replyRoutes);
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/personalized", personalizedRoutes);

app.use("/api/battle", battleRoutes);

module.exports = app;