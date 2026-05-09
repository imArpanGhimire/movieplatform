import api from "../api/axios";

export const getPersonalizedHome = async () => {
    // Read genres the user picked in the genre modal (saved by Navbar)
    const stored = localStorage.getItem("preferredGenres");
    const preferredGenres = stored ? JSON.parse(stored) : [];

    const res = await api.get("/personalized/home", {
        params: {
            // Send as comma-separated string e.g. "27,53,9648"
            genres: preferredGenres.length > 0 ? preferredGenres.join(",") : undefined,
        },
    });

    return res.data;
};