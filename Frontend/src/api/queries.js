import api from "./axios";

export const fetchTopRatedMovies = async () => {
    const res = await api.get("/tmdb/toprated");
    return res.data.movies || [];
};