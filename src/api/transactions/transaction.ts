import type { accountSchema, transactionSchema } from '@/constant/schema';
import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination
} from '@/interfaces/api.interface';
import type { TransactionData } from '@/interfaces/data.interface';
import type { SecuredAPIResponse } from '@/interfaces/security.interface';
import authClient from '@/utils/authQuery';
import unAuthClient from '@/utils/unAuthQuery';
import { invoke } from '@tauri-apps/api/tauri';
import type { AxiosResponse } from 'axios';
import type { z } from 'zod';

const getAllTransaction = async (params: QueryDataWithPagination) => {
	const encrypted_data: AxiosResponse<SecuredAPIResponse> = await authClient.get(
		`/payment/api/v1/transactions`,
		{ params: params }
	);

	// pub struct DecryptDataPayload {
	// 	// pub partner_id: String,
	// 	pub data: String,
	// 	pub tag: String,
	// 	pub keypair_hash: String,
	//  }

	console.log('res', encrypted_data);
	const decrypted = await invoke('decrypt_payload', {
		payload: {
			data: encrypted_data.data.data,
			keypair_hash: encrypted_data.data.secret_key,
			tag: encrypted_data.data.tag
		}
	}).catch((e) => console.log('bruh', e));
	console.log('data', decrypted);

	// const data: ApiDataResponseMeta<TransactionData[]> = JSON.parse(decrypted);

	// return {
	// data: data.transactions,
	// meta: data.meta
	// };
};

const getTransactionByID = async (id: number) => {
	const { data }: AxiosResponse<ApiResponse<TransactionData>> = await authClient.get(
		`/payment/api/v1/transactions/${id}`
	);
	return data.data;
};

const createNewTransaction = async (trx: z.infer<typeof transactionSchema>) => {
	await unAuthClient.post(`/payment/api/v1/transactions`, trx);
};

// const updateTransaction = async (editTransactionData: z.infer<typeof updateTransactionSchema>, id: string) => {
// 	await authClient.put(`/payment/api/v1/accounts/${id}`, editTransactionData);
// };

const deleteTransaction = async (id: number) => {
	await authClient.delete(`/payment/api/v1/transactions/${id}`);
};

export {
	getAllTransaction,
	getTransactionByID,
	createNewTransaction,
	// updateTransaction,
	deleteTransaction
};
