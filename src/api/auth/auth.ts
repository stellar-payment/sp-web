import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/interfaces/api.interface";
import type { UserAuthData, UserLoginData } from "@/interfaces/auth.interface";
import unAuthClient from "@/utils/unAuthQuery"

const login = async (userLoginData: UserLoginData) => {
    const { data }: AxiosResponse<ApiResponse<UserAuthData>> =
        await unAuthClient.post("/account/api/v1/auth/login", userLoginData);
    return data.data;
};


export {
    login,
}