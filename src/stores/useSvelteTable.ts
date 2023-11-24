import { type TableOptions, getCoreRowModel, getSortedRowModel, createSvelteTable, type ColumnDef } from "@tanstack/svelte-table"
import { writable } from "svelte/store"

interface useSvelteTableParams<T> {
    data: T[],
    columns: ColumnDef<T>[]
    debugTable: boolean
}

export function useSvelteTable<T>({ data, columns, debugTable }: useSvelteTableParams<T>) {
    const options = writable<TableOptions<T>>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: debugTable,
    })

    const table = createSvelteTable(options)

    return {
        table, options
    }
}