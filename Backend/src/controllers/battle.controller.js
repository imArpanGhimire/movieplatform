const axios = require("axios");
const Battle = require("../models/battle.model");

const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
};

const getRandomPage = () => {
    return Math.floor(Math.random() * 20) + 1;
};

const shuffleMovies = (movies) => {
    return [...movies].sort(() => Math.random() - 0.5);
};

const formatMovie = (movie) => {
    return {
        tmdbId: String(movie.id),
        title: movie.title,
        poster: movie.poster_path,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
    };
};

const fetchRandomMoviesFromTMDB = async () => {
    const page = Math.floor(Math.random() * 5) + 1;

    const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: "en-US",
                sort_by: "vote_count.desc",
                "vote_count.gte": 1000,
                "vote_average.gte": 7.1,
                include_video: false,
                page,
            },
        }
    );

    const movies = response.data.results
        .filter(
            (movie) =>
                movie.poster_path &&
                movie.title &&
                movie.release_date &&
                movie.vote_average >= 7.1 &&
                movie.vote_count >= 1000
        )
        .map(formatMovie);

    return shuffleMovies(movies);
};

const formatBattle = (battle, userId) => {
    const votesA = battle.votes.filter(
        (vote) => vote.selectedMovie === "movieA"
    ).length;

    const votesB = battle.votes.filter(
        (vote) => vote.selectedMovie === "movieB"
    ).length;

    const totalVotes = votesA + votesB;

    const userVote = battle.votes.find(
        (vote) => vote.user.toString() === userId
    );

    return {
        _id: battle._id,
        movieA: battle.movieA,
        movieB: battle.movieB,
        battleDate: battle.battleDate,
        votesA,
        votesB,
        totalVotes,
        percentageA:
            totalVotes === 0 ? 0 : Math.round((votesA / totalVotes) * 100),
        percentageB:
            totalVotes === 0 ? 0 : Math.round((votesB / totalVotes) * 100),
        hasVoted: Boolean(userVote),
        selectedMovie: userVote ? userVote.selectedMovie : null,
        createdAt: battle.createdAt,
    };
};

const generateTodayBattlesIfNeeded = async () => {
    const today = getTodayDate();

    const existingBattles = await Battle.find({
        battleDate: today,
        isActive: true,
    });

    if (existingBattles.length > 0) {
        return existingBattles;
    }

    const movies = await fetchRandomMoviesFromTMDB();

    if (movies.length < 6) {
        throw new Error("Not enough movies received from TMDB");
    }

    const battlesToCreate = [
        {
            movieA: movies[0],
            movieB: movies[1],
            battleDate: today,
        },
        {
            movieA: movies[2],
            movieB: movies[3],
            battleDate: today,
        },
        {
            movieA: movies[4],
            movieB: movies[5],
            battleDate: today,
        },
    ];

    const createdBattles = await Battle.insertMany(battlesToCreate);

    return createdBattles;
};

const getTodayBattles = async (req, res) => {
    try {
        const battles = await generateTodayBattlesIfNeeded();

        const formattedBattles = battles.map((battle) =>
            formatBattle(battle, req.user.id)
        );

        res.status(200).json({
            success: true,
            battles: formattedBattles,
        });
    } catch (error) {
        console.log("Get today battles error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching battles",
        });
    }
};

const voteBattle = async (req, res) => {
    try {
        const { battleId } = req.params;
        const { selectedMovie } = req.body;

        if (!["movieA", "movieB"].includes(selectedMovie)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie selection",
            });
        }

        const battle = await Battle.findById(battleId);

        if (!battle) {
            return res.status(404).json({
                success: false,
                message: "Battle not found",
            });
        }

        const alreadyVoted = battle.votes.find(
            (vote) => vote.user.toString() === req.user.id
        );

        if (alreadyVoted) {
            return res.status(400).json({
                success: false,
                message: "You already voted in this battle",
            });
        }

        battle.votes.push({
            user: req.user.id,
            selectedMovie,
        });

        await battle.save();

        const formattedBattle = formatBattle(battle, req.user.id);

        res.status(200).json({
            success: true,
            message: "Vote submitted successfully",
            battle: formattedBattle,
        });
    } catch (error) {
        console.log("Vote battle error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while voting",
        });
    }
};

const getBattleHistory = async (req, res) => {
    try {
        const today = getTodayDate();

        const battles = await Battle.find({
            battleDate: { $ne: today },
        }).sort({ battleDate: -1, createdAt: -1 });

        const formattedHistory = battles.map((battle) =>
            formatBattle(battle, req.user.id)
        );

        res.status(200).json({
            success: true,
            history: formattedHistory,
        });
    } catch (error) {
        console.log("Get battle history error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching battle history",
        });
    }
};

module.exports = {
    getTodayBattles,
    voteBattle,
    getBattleHistory,
};