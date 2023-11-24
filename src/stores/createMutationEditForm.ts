import { QueryObserver, createMutation, useQueryClient } from '@tanstack/svelte-query';
import toast from 'svelte-french-toast';
import { validator } from '@felte/validator-zod';
import type { ZodSchema } from 'zod';
import axios, { type AxiosError } from 'axios';
import type { ApiResponse } from '@/interfaces/api.interface';
import { translate } from '../utils/utils';
import { get, writable } from 'svelte/store';
import { push } from 'svelte-spa-router';
import { createForm } from 'felte';
import { reporter } from '@felte/reporter-svelte';

interface MutationFormParams<T> {
	mutationApi: (data: T, id?: number) => any;
	actionName: string;
	formSchema: ZodSchema;
	queryKey: string[];
	queryFn: (id: string) => any;
	enabled?: boolean;
	successFn?: (data: any) => void;
	errorFn?: (err: any) => void;
	refetch?: () => void;
	callbackRoute?: string;
	submitTransform?: (value: T) => any;
	modifyQuery?: (value: T) => any;
}

export function createMutationEditForm<T>({
	queryFn,
	enabled,
	queryKey,
	mutationApi,
	actionName,
	successFn,
	errorFn,
	refetch,
	callbackRoute,
	formSchema,
	submitTransform,
	modifyQuery
}: MutationFormParams<T>) {
	const { form, data, setData, setInitialValues, reset, setFields } = createForm({
		extend: [reporter, validator({ schema: formSchema, level: 'error' })],
		onSubmit(values) {
			if (submitTransform) {
				pushData({
					id: get(selectedID),
					...submitTransform(formSchema.parse(values))
				});
			} else {
				pushData({
					id: get(selectedID),
					...formSchema.parse(values)
				});
			}
		}
	});

	const onSuccess = (data: T) => {
		if (successFn) {
			successFn(data);
		}
	};

	const onError = (err: Error | AxiosError<ApiResponse<unknown>>) => {
		if (axios.isAxiosError(err) && err.response) {
			const response = err.response.data as ApiResponse<unknown>;
			toast.error(translate(`api_error.${response.error.code}`), {
				position: 'bottom-center'
			});
		} else if (axios.isAxiosError(err)) {
			toast.error(`Fetch Failed!`);
		}
	};

	const selectedID = writable(0);
	const client = useQueryClient();

	let query = new QueryObserver(client, {
		queryKey: [...queryKey, get(selectedID).toString()],
		queryFn: () => {
			return queryFn('0');
		},
		onSuccess: onSuccess,
		onError: onError,
		enabled: get(selectedID) == 0 ? false : enabled,
		refetchOnWindowFocus: false
	});

	const mutation = createMutation({
		mutationFn: (data: T) => {
			return mutationApi(data, get(selectedID));
		},
		onSuccess: (data) => {
			toast.success(
				translate(`success.success`, {
					data: actionName
				}),
				{
					position: 'bottom-center'
				}
			);
			if (successFn) {
				console.log(data);
				successFn(data);
			}
			if (callbackRoute) {
				push(callbackRoute);
			}
			if (refetch) {
				refetch();
			}
		},
		onError: (err: Error | AxiosError<ApiResponse<unknown>>) => {
			if (axios.isAxiosError(err) && err.response) {
				const response = err.response.data as ApiResponse<unknown>;
				toast.error(
					translate(`api_error.${response.error.code}`, {
						data: actionName
					}),
					{
						position: 'bottom-center'
					}
				);
			} 

			if (errorFn) {
				errorFn(err);
			}
		}
	});
	const mutate = get(mutation).mutate;

	const pushData = (data: any) => {
		mutate(data);
	};

	const setSelectedID = (id: number) => {
		selectedID.set(id);
	};

	selectedID.subscribe((value) => {
		console.log('SelectedID', value);
		query.setOptions({
			queryKey: [...queryKey, value.toString()],
			queryFn: () => {
				return queryFn(value.toString());
			},
			onSuccess: onSuccess,
			onError: onError,
			enabled: value == 0 ? false : enabled,
			refetchOnWindowFocus: false
		});
		client.invalidateQueries([...queryKey]);
	});

	query.subscribe(async (query) => {
		console.log('SetInitial', query.data);
		if (modifyQuery) {
			setFields(modifyQuery(query.data));
		} else {
			setFields(query.data);
		}
	});

	return {
		form: {
			form,
			data,
			setData,
			setInitialValues,
			reset,
			setFields
		},
		mutation: {
			mutation
		},
		setSelectedID
	};
}
