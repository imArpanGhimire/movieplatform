import axios from "axios"

const api = axios.create({
    baseURL: "https://filmvault-backend-bukf.onrender.com/api",
    withCredentials: true,
})

export default api