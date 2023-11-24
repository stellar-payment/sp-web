import type { CustomOption } from "@/interfaces/ui.interfaces";

const PAGINATION_LIMIT_OPTION: CustomOption[] = [
    {
        label: "25",
        value: 25
    },
    {
        label: "50",
        value: 50
    },
]

const DAYS_MAP: string[] = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

const MONTH_MAP: string[] = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

const DOTS = '...'

const DEFAULT_DOCUMENT_FILE_TYPE : string[] = ['png', 'jpg', "pdf", "jpeg"]

const DEFAULT_FILE_SIZE = 5000

const BRAND_ORANGE = "#E73827";


export {
    PAGINATION_LIMIT_OPTION,
    DOTS,
    BRAND_ORANGE,
    DAYS_MAP,
    MONTH_MAP,
    DEFAULT_DOCUMENT_FILE_TYPE,
    DEFAULT_FILE_SIZE
}