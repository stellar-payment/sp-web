import type { ApiResponse } from '@/interfaces/api.interface';
import { translate } from '@/utils/utils';
import { validator } from '@felte/validator-zod';
import { createMutation } from '@tanstack/svelte-query';
import axios, { AxiosError } from 'axios';
import { createForm } from 'felte';
import toast from 'svelte-french-toast';
import { push } from 'svelte-spa-router';
import type { ZodSchema } from 'zod';
import { get, writable } from 'svelte/store';
import { reporter } from '@felte/reporter-svelte';

interface createAddModalParams<T> {
	mutationApi: (data: T) => any;
	actionName: string;
	formSchema: ZodSchema;
	successFn?: (data: any) => void;
	errorFn?: (err: any) => void;
	refetch?: () => void;
	callbackRoute?: string;
	submitTransform?: (value: T) => any;
}

export function createAddModal<T>({
	mutationApi,
	actionName,
	formSchema,
	successFn,
	errorFn,
	refetch,
	callbackRoute,
	submitTransform
}: createAddModalParams<T>) {
	const { form, data, setData, setInitialValues, setFields, reset } = createForm({
		extend: [reporter, validator({ schema: formSchema, level: 'error' })],
		onSubmit(values) {
			if (submitTransform) {
				pushData(submitTransform(formSchema.parse(values)));
			} else {
				pushData(
					formSchema.parse({
						...values
					})
				);
			}
		}
	});

	const isOpen = writable(false);

	const openModal = () => {
		isOpen.set(true);
	};

	const closeModal = () => {
		isOpen.set(false);
	};

	const mutation = createMutation({
		mutationFn: (data: T) => {
			return mutationApi(data);
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
			closeModal();
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

	data.subscribe((data) => {
		console.log(data);
	});

	return {
		form: {
			form,
			setData,
			setFields,
			setInitialValues,
			reset,
			data
		},
		mutation,
		modal: {
			isOpen,
			closeModal,
			openModal
		}
	};
}
