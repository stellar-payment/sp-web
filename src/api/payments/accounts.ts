import type { accountSchema, updateAccountSchema } from '@/constant/schema';
import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination
} from '@/interfaces/api.interface';
import type { AccountData } from '@/interfaces/data.interface';
import type { EncryptedData, SecuredAPIResponse } from '@/interfaces/security.interface';
import authClient from '@/utils/authQuery';
import secureAuthClient from '@/utils/secureAuthQuery';
import unAuthClient from '@/utils/unAuthQuery';
import { invoke } from '@tauri-apps/api';
import type { AxiosError, AxiosResponse } from 'axios';
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

const getAccountByNo = async (no: string) => {
	const { data }: AxiosResponse<ApiResponse<AccountData>> = await authClient.get(
		`/payment/api/v1/accounts/no/${no}`
	);
	return data.data;
};

const createNewAccount = async (customer: z.infer<typeof accountSchema>) => {
	await authClient.post(`/payment/api/v1/accounts`, customer);
};

const updateAccount = async (editAccountData: z.infer<typeof updateAccountSchema>, id: string) => {
	await authClient.put(`/payment/api/v1/accounts/${id}`, editAccountData);
};

const deleteAccount = async (id: string) => {
	await authClient.delete(`/payment/api/v1/accounts/${id}`);
};

const authenticateAccount = async (acc_no: string, pin: string) => {
	const encrypted_payload: EncryptedData = await invoke('encrypt_payload', {
		payload: JSON.stringify({
			account_no: acc_no,
			pin: pin
		})
	});

	console.log(encrypted_payload);

	await secureAuthClient.post(
		`/payment/api/v1/accounts/authenticate`,
		`${encrypted_payload.data}.${encrypted_payload.tag}`,
		{
			headers: {
				'X-Sec-Keypair': encrypted_payload.keypair_hash,
				'Content-Type': 'text/plain'
			}
		}
	);

	return;
};

export {
	getAllAccount,
	getAccountByID,
	getAccountByNo,
	getMeAccount,
	createNewAccount,
	updateAccount,
	deleteAccount,
	authenticateAccount
};
