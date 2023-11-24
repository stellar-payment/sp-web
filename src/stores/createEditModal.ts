import type { ApiResponse } from "@/interfaces/api.interface";
import { translate } from "@/utils/utils";
import { validator } from "@felte/validator-zod";
import {
  QueryObserver,
  createMutation,
  useQueryClient,
} from "@tanstack/svelte-query";
import axios, { AxiosError } from "axios";
import { createForm } from "felte";
import toast from "svelte-french-toast";
import { push } from "svelte-spa-router";
import type { ZodSchema } from "zod";
import { get, writable } from "svelte/store";
import { reporter } from "@felte/reporter-svelte";

interface createEditModalParams<T> {
  mutationApi: (data: T, id: string) => any;
  actionName: string;
  formSchema: ZodSchema;
  queryKey: string[];
  queryFn: (id: string) => any;
  successFn?: (data: any) => void;
  errorFn?: (err: any) => void;
  refetch?: () => void;
  callbackRoute?: string;
  enabled?: boolean;
  submitTransform?: (value: T) => any;
}

export function createEditModal<T>({
  mutationApi,
  actionName,
  formSchema,
  successFn,
  errorFn,
  refetch,
  callbackRoute,
  queryKey,
  enabled,
  queryFn,
  submitTransform,
}: createEditModalParams<T>) {
  const isOpen = writable(false);
  const selectedID = writable('');
  const client = useQueryClient();

  const onSuccess = (data: T) => {
    if (successFn) {
      successFn(data);
    }
  };

  const onError = (err: Error | AxiosError<ApiResponse<unknown>>) => {
    if (axios.isAxiosError(err) && err.response) {
      const response = err.response.data as ApiResponse<unknown>;
      toast.error(translate(`api_error.${response.error.code}`), {
        position: "bottom-center",
      });
    } else if (axios.isAxiosError(err)) {
      toast.error(`Fetch Failed!`);
    }
  };

  const changeSelectedID = (id: string | number) => {
    selectedID.set(id as string);
  };

  const openModal = () => {
    isOpen.set(true);
  };

  const closeModal = () => {
    isOpen.set(false);
  };

  const modalAction = (id: string | number) => {
    selectedID.set(id as string);
    openModal();
  };

  const { form, data, setData, setInitialValues, reset, setFields } =
    createForm({
      extend: [reporter, validator({ schema: formSchema, level: "error" })],
      onSubmit(values) {
        if (submitTransform) {
          pushData(
            submitTransform(
              formSchema.parse({
                ...values,
                id: selectedID,
              })
            )
          );
        } else {
          pushData(
            formSchema.parse({
              ...values,
              id: selectedID,
            })
          );
        }
      },
    });

  let query = new QueryObserver(client, {
    queryKey: [...queryKey, get(selectedID).toString()],
    queryFn: () => {
      return queryFn("0");
    },
    onSuccess: onSuccess,
    onError: onError,
    enabled: get(selectedID) == "" ? false : enabled,
    refetchOnWindowFocus: false,
  });

  const mutation = createMutation({
    mutationFn: (data: T) => {
      return mutationApi(data, get(selectedID));
    },
    onSuccess: (data) => {
      toast.success(
        translate(`success.success`, {
          data: actionName,
        }),
        {
          position: "bottom-center",
        }
      );
      query.refetch();
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
    onError: onError,
  });

  const mutate = get(mutation).mutate;

  const pushData = (data: any) => {
    mutate(data);
  };

  selectedID.subscribe((value) => {
    console.log("SelectedID", value);
    query.setOptions({
      queryKey: [...queryKey, value.toString()],
      queryFn: () => {
        return queryFn(value.toString());
      },
      onSuccess: onSuccess,
      onError: onError,
      enabled: value == "" ? false : enabled,
      refetchOnWindowFocus: false,
    });
    client.invalidateQueries([...queryKey]);
  });

  query.subscribe((query) => {
    if (query.data) {
      setInitialValues(query.data);
      reset();
    }
  });

  return {
    form: {
      form,
      changeSelectedID,
      setData,
      setInitialValues,
      reset,
      data,
      setFields,
    },
    query: {
      query,
    },
    mutation,
    modal: {
      isOpen,
      closeModal,
      openModal,
      modalAction,
    },
  };
}
