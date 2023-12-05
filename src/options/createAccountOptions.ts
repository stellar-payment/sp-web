import { getAllAccount } from "@/api/payments/accounts";
import type { ParsedDataResponseMeta } from "@/interfaces/api.interface";
import type { AccountData } from "@/interfaces/data.interface";
import type { CustomOption } from "@/interfaces/ui.interfaces";
import { QueryObserver, useQueryClient } from "@tanstack/svelte-query";
import { get, writable, type Writable } from "svelte/store";

type AccountOptionParams = {
  namedKey? : string
}

export function createAccountOptions({namedKey}: AccountOptionParams) {
  const options: Writable<CustomOption[]> = writable([]);
  const isLoading: Writable<boolean> = writable(true);
  const keyword: Writable<string> = writable("");
  const client = useQueryClient();
  const key = "accounts";

  const parseData = (data: ParsedDataResponseMeta<AccountData[]>) => {
    const tempOptions = data.data?.map((singleData: AccountData) => {
      return {
        label: singleData.owner_name,
        value: singleData.id,
      } as CustomOption;
    });
    console.log("ParseData", data);
    options.set(tempOptions);
    isLoading.set(false);
  };

  const queryOption = {
    onSuccess: parseData,
    queryFn: () => {
      return getAllAccount(
        {
          keyword: get(keyword),
          active: 1,
          limit: 999,
          page: 1,
        }
      );
    },
    queryKey: [key, get(keyword), namedKey],
  };

  const query = new QueryObserver(client, queryOption);

  keyword.subscribe(() => {
    query.setOptions(queryOption);
    client.invalidateQueries([key]);
  });

  return {
    keyword,
    query,
    options,
    isLoading,
  };
}
