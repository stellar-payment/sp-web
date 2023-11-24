import { createMutation } from '@tanstack/svelte-query';
import toast from 'svelte-french-toast';
import { validator } from '@felte/validator-zod';
import type { AnyZodObject, ZodSchema } from 'zod';
import axios, { type AxiosError } from 'axios';
import type { ApiResponse } from '@/interfaces/api.interface';
import { translate } from '../utils/utils';
import { get } from 'svelte/store';
import { push } from 'svelte-spa-router';
import { createForm } from 'felte';
import { reporter } from '@felte/reporter-svelte';

interface MutationFormParams<T> {
	mutationApi: (data: T) => any;
	actionName: string;
	formSchema: ZodSchema;
	successFn?: (data: any) => void;
	errorFn?: (err: any) => void;
	refetch?: () => void;
	callbackRoute?: string;
	submitTransform?: (value: T) => any;
}

export function createMutationForm<T>({
	mutationApi,
	actionName,
	successFn,
	errorFn,
	refetch,
	callbackRoute,
	formSchema,
	submitTransform
}: MutationFormParams<T>) {
	const { form, data, setData, setInitialValues, reset, setFields } = createForm({
		extend: [reporter, validator({ schema: formSchema, level: 'error' })],
		onSubmit(values) {
			if (submitTransform) {
				pushData(submitTransform(formSchema.parse(values)));
			} else {
				pushData(formSchema.parse(values));
			}
		}
	});

	const mutation = createMutation({
		mutationFn: (data: T) => {
			let res = mutationApi(data);
			console.log('q', res);
			return res;
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
			} else {
				toast.error(err.message, {
					position: 'bottom-center'
				});
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
		}
	};
}
