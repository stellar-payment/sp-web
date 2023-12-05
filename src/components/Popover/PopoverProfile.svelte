<script lang="ts">
  import type { Writable } from "svelte/store";
  import { UserAuthDataStore, resetAuthUser } from "@/stores/auth";
  import { getInitials, translate } from "@/utils/utils";
  import { push } from "svelte-spa-router";
  import { slide } from "svelte/transition";

  export let isOpen: boolean;

  const handleClick = () => {
    resetAuthUser();
    isOpen = false;
    push("/");
  };
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="absolute top-[50px] right-8 bg-white rounded-md flex flex-col gap-3 w-[200px] shadow-md items-center z-[20]"
    id="notification-modal"
    transition:slide
  >
    <div class="w-full flex items-center gap-2 px-3">
      <div
        class="w-[40px] h-[40px] rounded-full border-[1px] flex items-center justify-center bg-gray-200 flex-shrink-0"
        id="profile-button"
      >
          <p class="text-sm font-bold" id="profile-button">
            {getInitials($UserAuthDataStore.display_name)}
          </p>
      </div>
      <div class="flex flex-col">
        <p class="font-semibold">{$UserAuthDataStore.display_name}</p>
        <p class="">{translate(`role_id.${$UserAuthDataStore.role_id}`)}</p>
      </div>
    </div>
    <div class="flex flex-col w-full justify-end">
      <button
        class="border-[1px] w-full text-start text-sm px-3 py-2"
        on:click={handleClick}
      >
        Log Out
      </button>
    </div>
  </div>
{/if}
