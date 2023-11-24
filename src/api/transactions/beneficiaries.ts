import type { accountSchema, transactionSchema } from '@/constant/schema';
import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination
} from '@/interfaces/api.interface';
import type { BeneficiaryData } from '@/interfaces/data.interface';
import type { SecuredAPIResponse } from '@/interfaces/security.interface';
import authClient from '@/utils/authQuery';
import unAuthClient from '@/utils/unAuthQuery';
import { invoke } from '@tauri-apps/api/tauri';
import type { AxiosResponse } from 'axios';
import type { z } from 'zod';

const getAllBeneficiary = async (params: QueryDataWithPagination) => {
	const { data }: AxiosResponse<ApiResponse<ApiDataResponseMeta<BeneficiaryData[][]>>> =
		await authClient.get(`/payment/api/v1/beneficiaries`, { params: params });
	return {
		data: data.data.beneficiaries,
		meta: data.data.meta
	};

	// try {
	// 	const encrypted_data: AxiosResponse<SecuredAPIResponse> = await authClient.get(
	// 		`/payment/api/v1/beneficiaries`,
	// 		{ params: params }
	// 	);

	// 	const decrypted = await invoke('decrypt_payload', {
	// 		payload: {
	// 			data: encrypted_data.data.data,
	// 			keypair_hash: encrypted_data.data.secret_key,
	// 			tag: encrypted_data.data.tag
	// 		}
	// 	})

	// 	const resp: ApiResponse<ApiDataResponseMeta<BeneficiaryData[]>> = JSON.parse(decrypted as string);
	// 	return {
	// 		data: resp.data.transactions,
	// 		meta: resp.data.meta
	// 	};
	// } catch (e) {
	// 	console.log('err', e);
	// 	return Promise.reject(Error(e as string));
	// }
};

const getBeneficiaryByID = async (id: number) => {
	const { data }: AxiosResponse<ApiResponse<BeneficiaryData>> = await authClient.get(
		`/payment/api/v1/beneficiaries/${id}`
	);
	return data.data;
};

const createNewBeneficiary = async (trx: z.infer<typeof transactionSchema>) => {
	await unAuthClient.post(`/payment/api/v1/beneficiaries`, trx);
};

// const updateBeneficiary = async (editBeneficiaryData: z.infer<typeof updateBeneficiarySchema>, id: string) => {
// 	await authClient.put(`/payment/api/v1/accounts/${id}`, editBeneficiaryData);
// };

const deleteBeneficiary = async (id: number) => {
	await authClient.delete(`/payment/api/v1/beneficiaries/${id}`);
};

export {
	getAllBeneficiary,
	getBeneficiaryByID,
	createNewBeneficiary,
	// updateBeneficiary,
	deleteBeneficiary
};
