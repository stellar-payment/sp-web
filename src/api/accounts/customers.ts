import type { customerSchema, updateCustomerSchema } from '@/constant/schema';
import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination
} from '@/interfaces/api.interface';
import type { CustomerData } from '@/interfaces/data.interface';
import authClient from '@/utils/authQuery';
import unAuthClient from '@/utils/unAuthQuery';
import type { AxiosResponse } from 'axios';
import type { z } from 'zod';

const getAllCustomer = async (params: QueryDataWithPagination) => {
	const { data }: AxiosResponse<ApiResponse<ApiDataResponseMeta<CustomerData[]>>> =
		await authClient.get(`/payment/api/v1/customers`, { params: params });
	return {
		data: data.data.customers,
		meta: data.data.meta
	};
};

const getMeCustomer = async () => {
	const { data }: AxiosResponse<ApiResponse<CustomerData>> = 
		await authClient.get(`/payment/api/v1/customers/me`)
	return data.data
}

const getCustomerByID = async (id: string | number) => {
	const { data }: AxiosResponse<ApiResponse<CustomerData>> = 
		await authClient.get(`/payment/api/v1/customers/${id}`)
	return data.data
}

const createNewCustomer = async (customer: z.infer<typeof customerSchema>) => {
    await unAuthClient.post(`/account/api/v1/register/customer`, customer);
}

const updateCustomer = async (editCustomerData: z.infer<typeof updateCustomerSchema>, id: string | number) => {
	await authClient.put(`/payment/api/v1/customers/${id}`, editCustomerData);
};

const deleteCustomer = async (id: string | number) => {
	await authClient.delete(`/payment/api/v1/customers/${id}`);
};


export {
	getAllCustomer,
	getCustomerByID,
	getMeCustomer,
	createNewCustomer,
	updateCustomer,
	deleteCustomer,
}