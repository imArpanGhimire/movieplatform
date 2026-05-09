const Battle = require("../models/battle.model");


const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
};

const sampleMovies = [
    {
        tmdbId: "157336",
        title: "Interstellar",
        poster: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        releaseDate: "2014-11-05",
        rating: 8.4,
    },
    {
        tmdbId: "27205",
        title: "Inception",
        poster: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        releaseDate: "2010-07-15",
        rating: 8.3,
    },
    {
        tmdbId: "155",
        title: "The Dark Knight",
        poster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        releaseDate: "2008-07-16",
        rating: 8.5,
    },
    {
        tmdbId: "680",
        title: "Pulp Fiction",
        poster: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        releaseDate: "1994-09-10",
        rating: 8.5,
    },
    {
        tmdbId: "13",
        title: "Forrest Gump",
        poster: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        releaseDate: "1994-06-23",
        rating: 8.5,
    },
    {
        tmdbId: "278",
        title: "The Shawshank Redemption",
        poster: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        releaseDate: "1994-09-23",
        rating: 8.7,
    },
    {
        tmdbId: "550",
        title: "Fight Club",
        poster: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        releaseDate: "1999-10-15",
        rating: 8.4,
    },
    {
        tmdbId: "603",
        title: "The Matrix",
        poster: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        releaseDate: "1999-03-30",
        rating: 8.2,
    },
];

const shuffleMovies = (movies) => {
    return [...movies].sort(() => Math.random() - 0.5);
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
        percentageA: totalVotes === 0 ? 0 : Math.round((votesA / totalVotes) * 100),
        percentageB: totalVotes === 0 ? 0 : Math.round((votesB / totalVotes) * 100),
        hasVoted: Boolean(userVote),
        selectedMovie: userVote ? userVote.selectedMovie : null,
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

    const shuffledMovies = shuffleMovies(sampleMovies);

    const battlesToCreate = [
        {
            movieA: shuffledMovies[0],
            movieB: shuffledMovies[1],
            battleDate: today,
        },
        {
            movieA: shuffledMovies[2],
            movieB: shuffledMovies[3],
            battleDate: today,
        },
        {
            movieA: shuffledMovies[4],
            movieB: shuffledMovies[5],
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

module.exports = {
    getTodayBattles,
    voteBattle,
};