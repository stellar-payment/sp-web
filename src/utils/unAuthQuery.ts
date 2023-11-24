import axios from "axios";

const unAuthClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: {
        "Content-Type": "application/json",
    },
});

export default unAuthClient;