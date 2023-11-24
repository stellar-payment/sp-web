import type { AxiosResponse } from 'axios';
import type {
	ApiDataResponseMeta,
	ApiResponse,
	QueryDataWithPagination,
	QueryDataWithPaginationObject
} from '@/interfaces/api.interface';
import type { UserData } from '@/interfaces/data.interface';
import authClient from '@/utils/authQuery';
import type { z } from 'zod';
import type { updateUserSchema, userSchema } from '@/constant/schema';

const getAllUser = async (params: QueryDataWithPagination) => {
	const { data }: AxiosResponse<ApiResponse<ApiDataResponseMeta<UserData[]>>> =
		await authClient.get('/account/api/v1/users', { params: params });
	return {
		data: data.data.users,
		meta: data.data.meta
	};
};

const createNewUser = async (userData: z.infer<typeof userSchema>) => {
	await authClient.post('/account/api/v1/users', userData);
};

const updateUser = async (editUserData: z.infer<typeof updateUserSchema>, id: string | number) => {
	await authClient.put(`/account/api/v1/users/${id}`, editUserData);
};

const deleteUser = async (id: string | number) => {
	await authClient.delete(`/account/api/v1/users/${id}`);
};

const getUserByID = async (id: string | number) => {
	const { data }: AxiosResponse<ApiResponse<UserData>> = await authClient.get(
		`/account/api/v1/users/${id}`
	);
	return data.data;
};

export {
    getAllUser,
    createNewUser,
    deleteUser,
    getUserByID,
    updateUser
}