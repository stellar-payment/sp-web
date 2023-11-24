import { invoke } from "@tauri-apps/api/tauri";
import type { InternalAxiosRequestConfig } from "axios";

async function handleSecOverride(config: InternalAxiosRequestConfig<any>) {
	if (import.meta.env.VITE_OVERRIDE_SEC == "1") {
        config.headers.set("X-Override-Sec", 1)
    }

    return config
}

async function handleSecPartnerID(config: InternalAxiosRequestConfig<any>) {
    const partnerID: string = await invoke("get_partner_id")
    
    config.headers.set("X-Partner-ID", partnerID)

    return config
}

export {
    handleSecOverride,
    handleSecPartnerID
}