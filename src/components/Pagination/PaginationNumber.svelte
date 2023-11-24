<script lang="ts">
  import { DOTS } from "@/constant/constant";

  export let setPage: (page: number) => void;
  export let pageNumber: number | string;
</script>

{#if pageNumber == DOTS && typeof pageNumber == "string"}
  <div class="">
    {pageNumber}
  </div>
{:else}
  <button
    class="bg-white rounded-full p-3 w-12 h-12 shadow-md"
    on:click={() => {
      setPage(pageNumber);
    }}
  >
    {pageNumber}
  </button>
{/if}
