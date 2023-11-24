<script lang="ts">
  import { flexRender, type Table } from "@tanstack/svelte-table";
  import type { Readable } from "svelte/store";

  type T = $$Generic;
  export let table: Readable<Table<T>>;
</script>

<div class="px-2 py-2 bg-brand-white rounded-md mt-10">
  <table class="w-full">
    <thead>
      {#each $table.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header}
            <th
              colSpan={header.colSpan}
              class={`font-roboto font-bold border-b-[2px] border-b-gray-300 text-center h-14`}
              style={`width: ${
                header.getSize() !== 150 ? header.getSize() : undefined
              };`}
            >
              <svelte:component
                this={header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              />
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each $table.getRowModel().rows as row}
        <tr>
          {#each row.getVisibleCells() as cell}
            <td
              class="max-w-xs border-b-[1px] boder-t-[1px] border-gray-200 text-center 2xl:text-base text-sm text-semibold text-gray-600"
            >
              <svelte:component
                this={flexRender(cell.column.columnDef.cell, cell.getContext())}
              />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
