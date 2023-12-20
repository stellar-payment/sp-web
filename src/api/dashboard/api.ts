import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination
} from '@/interfaces/api.interface';
import authClient from '@/utils/authQuery';
import type { AxiosResponse } from 'axios';

const getAdminDashboard = async () => {
	const { data }: AxiosResponse<ApiResponse<AdminDashboard>> = await authClient.get(
		'/payment/api/v1/dashboard/admin',
	);
	return data.data;
};

const getCustomerDashboard = async () => {
	const { data }: AxiosResponse<ApiResponse<CustomerDashboard>> =
		await authClient.get('/payment/api/v1/dashboard/customer',);
	return data.data;
};

const getMerchantDashboard = async () => {
	const { data }: AxiosResponse<ApiResponse<MerchantDashboard>> =
		await authClient.get('/payment/api/v1/dashboard/merchant',);
	return data.data;
};

export { getAdminDashboard, getMerchantDashboard, getCustomerDashboard };
