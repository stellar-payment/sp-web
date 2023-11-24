import type { accountSchema, updateAccountSchema } from '@/constant/schema';
import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination
} from '@/interfaces/api.interface';
import type { AccountData } from '@/interfaces/data.interface';
import authClient from '@/utils/authQuery';
import unAuthClient from '@/utils/unAuthQuery';
import type { AxiosResponse } from 'axios';
import type { z } from 'zod';

const getAllAccount = async (params: QueryDataWithPagination) => {
	const { data }: AxiosResponse<ApiResponse<ApiDataResponseMeta<AccountData[]>>> =
		await authClient.get(`/payment/api/v1/accounts`, { params: params });
	return {
		data: data.data.accounts,
		meta: data.data.meta
	};
};

const getMeAccount = async () => {
	const { data }: AxiosResponse<ApiResponse<AccountData>> = await authClient.get(
		`/payment/api/v1/accounts/me`
	);
	return data.data;
};

const getAccountByID = async (id: string) => {
	const { data }: AxiosResponse<ApiResponse<AccountData>> = await authClient.get(
		`/payment/api/v1/accounts/${id}`
	);
	return data.data;
};

const createNewAccount = async (customer: z.infer<typeof accountSchema>) => {
	await unAuthClient.post(`/payment/api/v1/accounts`, customer);
};

const updateAccount = async (editAccountData: z.infer<typeof updateAccountSchema>, id: string) => {
	await authClient.put(`/payment/api/v1/accounts/${id}`, editAccountData);
};

const deleteAccount = async (id: string) => {
	await authClient.delete(`/payment/api/v1/accounts/${id}`);
};

export {
	getAllAccount,
	getAccountByID,
	getMeAccount,
	createNewAccount,
	updateAccount,
	deleteAccount
};
