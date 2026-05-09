import api from "../api/axios";

export const getTodayBattles = async () => {
    const response = await api.get("/battle/today");
    return response.data;
};

export const voteBattle = async (battleId, selectedMovie) => {
    const response = await api.post(`/battle/vote/${battleId}`, {
        selectedMovie,
    });

    return response.data;
};