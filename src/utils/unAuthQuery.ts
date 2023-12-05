import { BASE_API } from "@/interfaces/api.interface";
import axios from "axios";

const unAuthClient = axios.create({
    baseURL: BASE_API,
    headers: {
        "Content-Type": "application/json",
    },
});

export default unAuthClient;