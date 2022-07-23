export type SearchSelectOption = {
    id: number,
    value: string
}

export type EntityData<T> = {
    content: T[],
    last: boolean,
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number
}

export type PaginationParams = {
    pageNo: number
    pageSize: number
    sortBy: string
    sortDir: string
    // searchText
}

