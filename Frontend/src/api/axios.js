import axios from "axios"

const api = axios.create({
    baseURL: "https://filmvault-backend-bukf.onrender.com",
    withCredentials: true,
})

export default api