const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authroutes = require("./routes/auth.routes");
const movieroutes = require("./routes/movie.routes");
const likesroutes = require("./routes/likes.routes");
const replyRoutes = require("./routes/reply.routes");
const tmdbRoutes = require("./routes/tmdb.routes");
const savedRoutes = require("./routes/saved.routes");
const personalizedRoutes = require("./routes/personalized.routes");
const battleRoutes = require("./routes/battle.routes");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: "Too many attempts, try again later" }
});

app.use("/api/auth", authLimiter, authroutes);
app.use("/api/movie", movieroutes);
app.use("/api/toggle", likesroutes);
app.use("/api/reply", replyRoutes);
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/personalized", personalizedRoutes);
app.use("/api/battle", battleRoutes);

module.exports = app;