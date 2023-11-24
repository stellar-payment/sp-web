import JSONbigint from "json-bigint";
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthUser } from "@/stores/auth";

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
  

export {
    jsonBigParse,
    handleAuth
}