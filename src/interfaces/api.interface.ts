export interface ApiError {
	code: number;
	msg: string;
}

export interface ApiResponse<T> {
	data: T;
	error: ApiError;
}

interface ApiDataResponse<ResponseType> {
	[key: string]: ResponseType;
}

interface Meta {
	meta: {
		limit: number;
		page: number;
	};
}

export type ApiDataResponseMeta<T> = ApiDataResponse<T> & Meta;

export interface PaginationData {
	limit: number;
	page: number;
}

export type QueryDataWithPagination = PaginationData & {
	[key: string | number]: any;
};

export interface QueryDataWithoutPagination {
	[key: string | number]: any;
}

export type QueryDataWithPaginationObject = {
	query: { [key: string]: string | number | boolean };
	meta: {
		page: number;
		limit: number;
	};
};
