import { createMutation } from "@tanstack/svelte-query";
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "@/interfaces/api.interface";
import toast from "svelte-french-toast";
import { get, writable, type Writable } from "svelte/store";
import { translate } from "@/utils/utils";

interface createBulkDeleteHandlerParams {
  mutationApi: (data: any) => any;
  refetch: () => void;
  successFn?: (data: any) => void;
  errorFn?: (err: any) => void;
  actionName: string;
}

export function createBulkDeleteHandler({
  successFn,
  errorFn,
  mutationApi,
  refetch,
  actionName,
}: createBulkDeleteHandlerParams) {
  const deletedID: Writable<Map<string, string>> = writable(new Map());
  const isOpen = writable(false);

  const openModal = () => {
    isOpen.set(true);
  };

  const closeModal = () => {
    isOpen.set(false);
    deletedID.set(new Map());
  };

  const modalAction = (id: string | number) => {
    addDeleteID(id as string);
    openModal();
  };

  const mutation = createMutation({
    mutationFn: (data) => {
      return mutationApi(data);
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

  const checkDeleteExist = (deleteValue: string) => {
    return Boolean(get(deletedID).get(deleteValue.toString()));
  };

  const addDeleteID = (deletedValue: string) => {
    if (!checkDeleteExist(deletedValue)) {
      deletedID.update((deletedID) => {
        const tempDeleteID = deletedID;
        tempDeleteID.set(deletedValue.toString(), deletedValue);
        return tempDeleteID;
      });
    }
  };

  const toggleDeleteID = (deleteValue: string) => {
    if (checkDeleteExist(deleteValue)) {
      deletedID.update((deletedID) => {
        const tempDeleteID = deletedID;
        tempDeleteID.delete(deleteValue.toString());
        return tempDeleteID;
      });
    } else {
      deletedID.update((deletedID) => {
        const tempDeleteID = deletedID;
        tempDeleteID.set(deleteValue.toString(), deleteValue);
        return tempDeleteID;
      });
    }
  };

  const checkDeleteIDEmpty = () => {
    return Boolean(get(deletedID).size);
  };

  const submitDelete = () => {
    mutate(Array.from(get(deletedID).values()) as any);
    deletedID.set(new Map());
  };

  deletedID.subscribe((value) => {
    console.log(value);
  });

  return {
    control: {
      deletedID,
      toggleDeleteID,
      submitDelete,
      checkDeleteExist,
      checkDeleteIDEmpty,
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
