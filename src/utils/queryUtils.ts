import JSONbigint from "json-bigint";
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthUser, resetAuthUser } from "@/stores/auth";
import type { ApiResponse } from "@/interfaces/api.interface";
import { push } from "svelte-spa-router";

async function handleAuth(config: InternalAxiosRequestConfig<any>) {
	const { access_token } = getAuthUser();

    if (!access_token) {
        return config
    }

    config.headers.setAuthorization(`Bearer ${access_token}`)

    return config
}

async function jsonBigParse(response: AxiosResponse) {
    response.data = JSONbigint.parse(response.data);
    return response;
  }
  
async function handleSession(res: AxiosResponse<ApiResponse<any>>) {
    console.log(res.data)
    
    if (res.data.error?.code == 403019) {
        resetAuthUser()
        push("/")
    }

    return res
}

export {
    jsonBigParse,
    handleAuth,
    handleSession
}