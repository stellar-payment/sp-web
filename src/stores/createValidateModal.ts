import { createMutation } from "@tanstack/svelte-query";
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "@/interfaces/api.interface";
import toast from "svelte-french-toast";
import { get, writable, type Writable } from "svelte/store";
import { translate } from "@/utils/utils";

interface createValidationHandlerParams {
  mutationApi: (id: string | number) => void;
  refetch: () => void;
  successFn?: (data: any) => void;
  errorFn?: (err: any) => void;
  actionName: string;
}

export function createValidationHandler({
  successFn,
  errorFn,
  mutationApi,
  refetch,
  actionName,
}: createValidationHandlerParams) {
  const validationID: Writable<string | number> = writable(0);
  const isOpen = writable(false);

  const openModal = () => {
    isOpen.set(true);
  };

  const closeModal = () => {
    isOpen.set(false);
  };

  const modalAction = (id: number) => {
    validationID.set(id);
    openModal();
  };

  const mutation = createMutation({
    mutationFn: (id: string | number) => {
      return mutationApi(id);
    },
    onSuccess: (data: any) => {
      toast.success(
        translate(`success.success`, {
          data: actionName,
        }),
        {
          position: "bottom-center",
        }
      );
      if (successFn) {
        console.log(data);
        successFn(data);
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
            data: actionName,
          }),
          {
            position: "bottom-center",
          }
        );
      }
      if (errorFn) {
        errorFn(err);
      }
    },
  });

  const mutate = get(mutation).mutate;

  const submitValidation = () => {
    mutate(get(validationID).toString());
    validationID.set(0);
  };

  validationID.subscribe((value) => {
    console.log(value);
  });

  return {
    control: {
      validationID,
      submitValidation,
    },
    modal: {
      isOpen,
      closeModal,
      openModal,
      modalAction,
    },
    mutation,
  };
}
