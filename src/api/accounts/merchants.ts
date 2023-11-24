import type { merchantSchema, updateMerchantSchema } from "@/constant/schema"
import type {  ApiDataResponseMeta, ApiResponse, QueryDataWithPagination } from "@/interfaces/api.interface"
import type { CustomerData, MerchantData } from "@/interfaces/data.interface"
import authClient from "@/utils/authQuery"
import unAuthClient from "@/utils/unAuthQuery"
import type { Axios, AxiosResponse } from "axios"
import type { z } from "zod"

const getAllMerchant = async (params: QueryDataWithPagination) => {
	const { data }: AxiosResponse<ApiResponse<ApiDataResponseMeta<MerchantData[]>>> =
	await authClient.get(`/payment/api/v1/merchants`, { params: params });
	return {
		data: data.data.merchants,
		meta: data.data.meta
	}
}

const getMeMerchant = async () => {
	const { data }: AxiosResponse<ApiResponse<MerchantData>> = 
		await authClient.get(`/payment/api/v1/merchants/me`)
	return data.data
}

const getMerchantByID = async (id: string) => {
	const { data }: AxiosResponse<ApiResponse<CustomerData>> =
		await authClient.get(`/payment/api/v1/merchants/${id}`)
	return data.data
}

const createNewMerchant = async (merchant: z.infer<typeof merchantSchema>) => {
    await unAuthClient.post(`/account/api/v1/register/merchant`, merchant);
}

const updateMerchant = async (editMerchantData: z.infer<typeof updateMerchantSchema>, id: string) => {
	await authClient.put(`/payment/api/v1/merchants/${id}`, editMerchantData);
}

const deleteMerchant = async (id: string) => {
	await authClient.delete(`/payment/api/v1/merchants/${id}`);
}

export {
	getAllMerchant,
	getMerchantByID,
	getMeMerchant,
	createNewMerchant,
	updateMerchant,
	deleteMerchant
}