import { PaginationParams } from "@/types/UtilsTypes";

const paginationParamsDefaults: PaginationParams = {
    pageNo: 0,
    pageSize:  5,
    sortBy: "id",
    sortDir: "asc"
}

export default paginationParamsDefaults;