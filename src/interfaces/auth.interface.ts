import type { loginSchema } from "@/constant/schema";
import type { z } from "zod";

interface UserAuthData {
    user_id: string;
    username: string;
    role_id: number;
    access_token: string;
}

interface UserStoreData {
    user_id: string;
    display_name: string;
    role_id: number;
    access_token: string;
}

interface UserAccountData {
    id: string, 
    owner_id: string, 
    account_type: number, 
    balance: number, 
    account_no: string
}

type UserLoginData = z.infer<typeof loginSchema>

type UserRegisterData = {
    user_id: string;
    username: string;
    role_id: number;
}

type ClientRegisterData = {
    name: string, 
	phone: string, 
	email: string, 
	address: string, 
	pic_name: string, 
	pic_phone: string, 
	pic_email: string,
    partner_secret: string, 
}

export type {
    UserAuthData,
    UserStoreData,
    UserLoginData,
    UserRegisterData,
    ClientRegisterData
    UserAccountData,
}