import axios from "axios";

const api = axios.create({
    baseURL: "https://mini-auction-l8xd.onrender.com/api"
});

export default api;