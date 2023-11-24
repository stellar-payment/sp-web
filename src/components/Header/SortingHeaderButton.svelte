<script lang="ts">
  import type { HeaderSorterProps } from "@/interfaces/ui.interfaces";

  export let headerSorter: HeaderSorterProps | undefined = undefined;
  export let label: string;
</script>

<div class="flex gap-2">
  <p class="font-bold font-roboto">
    {label}
  </p>
  {#if headerSorter}
    <div class="flex flex-col">
      <div
        class={`h-0 w-0 border-x-8 border-x-transparent border-b-[16px] ${
          headerSorter.sorting == "asc" ? "bg-gray-400" : "bg-brand-light"
        }`}
      />
      <div
        class={`h-0 w-0 border-x-8 border-x-transparent border-b-[16px] transform rotate-180 ${
          headerSorter.sorting == "desc" ? "bg-gray-400" : "bg-brand-light"
        }`}
      />
    </div>
  {/if}
</div>
