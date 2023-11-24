import { get, writable, type Writable } from "svelte/store";
import { QueryObserver, useQueryClient } from "@tanstack/svelte-query";
import type { ApiResponse, ParsedDataResponseMeta, QueryDataWithPagination, QueryDataWithoutPagination } from "@/interfaces/api.interface";
import type { AxiosError } from "axios";
import { translate } from "@/utils/utils";
import axios from "axios";
import toast from "svelte-french-toast";
import type { PaginationData } from "@/interfaces/ui.interfaces";

interface createPaginatedQueryParams<T> {
    queryObj: Writable<QueryDataWithoutPagination>,
    queryKey: string[],
    queryFunction: (queryObj: QueryDataWithPagination) => Promise<ParsedDataResponseMeta<T>>,
    successFn?: (data: ParsedDataResponseMeta<T>) => void;
    enabled?: boolean;
}

const DEFAULT_PAGINATION_STATE = {
    limit: 20,
    page: 1,
    max: 0
}

export function createPaginatedQuery<T>({ queryObj, queryKey, queryFunction, enabled, successFn }: createPaginatedQueryParams<T>) {
    const paginationStore = writable<PaginationData>(DEFAULT_PAGINATION_STATE)
    const client = useQueryClient();
    const queryOption = {
        queryKey: [...queryKey, get(queryObj), get(paginationStore)],
        queryFn: () => {
            return queryFunction({
                ...get(queryObj),
                page: get(paginationStore).page,
                limit: get(paginationStore).limit,
            })
        },
        onSuccess: (data: ParsedDataResponseMeta<T>) => {
            if (get(paginationStore).max != data.meta.total_page) {
                paginationStore.update((pagination) => {
                    return {
                        ...pagination,
                        max: data.meta.total_page
                    }
                })
            }
            if (successFn) {
                successFn(data);
            }
        },
        onError: (err: Error | AxiosError<ApiResponse<unknown>>) => {
            if (axios.isAxiosError(err) && err.response) {
                const response = err.response.data as ApiResponse<unknown>;
                toast.error(translate(`api_error.${response.error.code}`));
            } else if (axios.isAxiosError(err)) {
                toast.error(`Fetch Failed!`);
            }
        },
        enabled: enabled ? enabled : true
    }

    const nextPage = () => {
        paginationStore.update((pagination) => {
            return {
                ...pagination,
                page: pagination.page + 1
            }
        })
    }

    const previousPage = () => {
        paginationStore.update((pagination) => {
            return {
                ...pagination,
                page: pagination.page - 1
            }
        })
    }

    const setPage = (page: number) => {
        paginationStore.update((pagination) => {
            return {
                ...pagination,
                page: page
            }
        })
    }

    const resetPagination = () => {
        paginationStore.set(DEFAULT_PAGINATION_STATE)
    }

    const changePerPage = (limit: number) => {
        paginationStore.update((pagination) => {
            return {
                ...pagination,
                limit: limit
            }
        })
    }

    const query = new QueryObserver(client, queryOption)

    paginationStore.subscribe(() => {
        query.setOptions(queryOption)
        client.invalidateQueries([...queryKey])
    })

    queryObj.subscribe(() => {
        query.setOptions(queryOption)
        client.invalidateQueries([...queryKey])
        paginationStore.set(DEFAULT_PAGINATION_STATE)
    })

    return {
        query,
        paginationStore,
        control: {
            nextPage, previousPage, setPage, changePerPage, resetPagination
        }
    }
}