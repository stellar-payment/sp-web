import axios from "axios";
import { handleAuth } from "./queryUtils";
import { handleSecOverride, handleSecPartnerID } from "./headerUtils";
import { BASE_API } from "@/interfaces/api.interface";

const authClient = axios.create({
    baseURL: BASE_API,
    headers: {
        "Content-Type": "application/json"
    }
})

authClient.interceptors.request.use(handleAuth)
// authClient.interceptors.request.use(handleSecOverride)
authClient.interceptors.request.use(handleSecPartnerID)

export default authClient;