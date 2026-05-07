import api from "../api/axios";

export const getPersonalizedHome = async () => {
    const res = await api.get("/personalized/home");
    return res.data;
};