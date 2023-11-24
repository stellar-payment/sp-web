<script lang="ts">
  import { DOTS } from "@/constant/constant";
  import type { PaginationData } from "@/interfaces/api.interfaces";
  import type { Writable } from "svelte/store";
  import PaginationNumber from "./PaginationNumber.svelte";

  export let paginationStore: Writable<PaginationData>;
  export let siblingCount = 1;
  export let nextPage: () => void;
  export let previousPage: () => void;
  export let setPage: (page: number) => void;

  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPaginationRange = (
    maxPage: number,
    limit: number,
    siblingCount: number
  ) => {
    const totalPageCount = Math.ceil(maxPage / limit);
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(maxPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(maxPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  };

  $: paginationRange = getPaginationRange(
    $paginationStore.max,
    $paginationStore.limit,
    1
  );

  $: console.log("PaginationRange", paginationRange);
</script>

<div class="flex justify-between items-center">
  {#if $paginationStore.page > 1}
    <button class="p-2 shadow-md" on:click={previousPage}>
      {"<"}
    </button>
  {/if}
  <div class="flex gap-5">
    {#each paginationRange as pageNumber}
      <PaginationNumber {pageNumber} {setPage} />
    {/each}
  </div>
  {#if !($paginationStore.max == $paginationStore.page) && $paginationStore.max != 0}
    <button class="p-2 shadow-md" on:click={nextPage}> > </button>
  {/if}
</div>
