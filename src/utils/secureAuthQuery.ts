import axios from "axios";
import { handleAuth } from "./queryUtils";
import { handleSecOverride, handleSecPartnerID } from "./headerUtils";
import { BASE_API } from "@/interfaces/api.interface";

const secureAuthClient = axios.create({
    baseURL: BASE_API,
    headers: {
        "Content-Type": "text/plain"
    }
})


secureAuthClient.interceptors.request.use(handleAuth)
// authClient.interceptors.request.use(handleSecOverride)
secureAuthClient.interceptors.request.use(handleSecPartnerID)

export default secureAuthClient;
