import type { accountSchema, transactionSchema } from '@/constant/schema';
import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination
} from '@/interfaces/api.interface';
import type { TransactionData } from '@/interfaces/data.interface';
import type { DecryptedData, EncryptedData, SecuredAPIResponse } from '@/interfaces/security.interface';
import authClient from '@/utils/authQuery';
import unAuthClient from '@/utils/unAuthQuery';
import { invoke } from '@tauri-apps/api/tauri';
import type { AxiosError, AxiosResponse } from 'axios';
import type { z } from 'zod';
import { authenticateAccount } from '../payments/accounts';
import secureAuthClient from '@/utils/secureAuthQuery';

const getAllTransaction = async (params: QueryDataWithPagination) => {
	try {
		const encrypted_data: AxiosResponse<SecuredAPIResponse> = await authClient.get(
			`/payment/api/v1/transactions`,
			{ params: params }
		);

		const decrypted = await invoke('decrypt_payload', {
			payload: {
				data: encrypted_data.data.data,
				keypair_hash: encrypted_data.data.secret_key,
				tag: encrypted_data.data.tag
			}
		});

		const resp: ApiResponse<ApiDataResponseMeta<TransactionData[]>> = JSON.parse(
			decrypted as string
		);
		return {
			data: resp.data.transactions,
			meta: resp.data.meta
		};
	} catch (e) {
		console.log('err', e);
		return Promise.reject(Error(e as string));
	}
};

const getTransactionByID = async (id: number) => {
	const { data }: AxiosResponse<ApiResponse<TransactionData>> = await authClient.get(
		`/payment/api/v1/transactions/${id}`
	);
	return data.data;
};

const createNewTransactionP2P = async (trx: z.infer<typeof transactionSchema>) => {
	try {
		// authenticateAccount(trx.account_no, trx.pin).then((v) => console.log("aa", v));

		const encrypted_payload: EncryptedData = await invoke('encrypt_payload', {
			payload: JSON.stringify(trx)
		});

		const encrypted_data: AxiosResponse<SecuredAPIResponse> = await secureAuthClient.post(
			`/payment/api/v1/transactions/p2p`,
			`${encrypted_payload.data}.${encrypted_payload.tag}`,
			{
				headers: {
					'X-Sec-Keypair': encrypted_payload.keypair_hash,
					'Content-Type': "text/plain"
				}
			}
		);

		return
	} catch (e) {
		const data = (e as AxiosError).response?.data as SecuredAPIResponse
		const decrypted: string = await invoke('decrypt_payload', {
			payload: {
				data: data.data,
				keypair_hash: data.secret_key,
				tag: data.tag
			}
		});

		const errmeta = JSON.parse(decrypted)

		return Promise.reject(Error(errmeta.error.msg as string));
	}
};

const createNewTransactionP2B = async (trx: z.infer<typeof transactionSchema>) => {
	try {
		// authenticateAccount(trx.account_no, trx.pin).then((v) => console.log("aa", v));

		const encrypted_payload: EncryptedData = await invoke('encrypt_payload', {
			payload: JSON.stringify(trx)
		});

		const encrypted_data: AxiosResponse<SecuredAPIResponse> = await secureAuthClient.post(
			`/payment/api/v1/transactions/p2b`,
			`${encrypted_payload.data}.${encrypted_payload.tag}`,
			{
				headers: {
					'X-Sec-Keypair': encrypted_payload.keypair_hash,
					'Content-Type': "text/plain"
				}
			}
		);

		return
	} catch (e) {
		const data = (e as AxiosError).response?.data as SecuredAPIResponse
		const decrypted: string = await invoke('decrypt_payload', {
			payload: {
				data: data.data,
				keypair_hash: data.secret_key,
				tag: data.tag
			}
		});

		const errmeta = JSON.parse(decrypted)

		return Promise.reject(Error(errmeta.error.msg as string));
	}
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
	createNewTransactionP2P,
	createNewTransactionP2B,
	// updateTransaction,
	deleteTransaction
};
