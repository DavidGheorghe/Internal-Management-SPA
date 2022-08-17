export class APIUrls {
    static readonly BASE_URL = "http://localhost:8080/api";
    static readonly API_LOGIN_URL = APIUrls.BASE_URL + "/auth/login";
    static readonly API_REFRESH_TOKEN = APIUrls.BASE_URL + "/auth/refresh-token";

    static readonly API_PRODUCTS_ROOT = APIUrls.BASE_URL + "/products";
    static readonly API_PRODUCT_CATEGORIES = APIUrls.BASE_URL + "/product-categories";
    static readonly API_COLORS_ROOT = APIUrls.BASE_URL + "/colors";
    static readonly API_CUSTOMERS_ROOT = APIUrls.BASE_URL + "/customers";
    static readonly API_ORDERS_ROOT = APIUrls.BASE_URL + "/orders";
    static readonly API_TODOS_ROOT = APIUrls.BASE_URL + "/todos";
    static readonly API_CHANGE_PASSWORD = APIUrls.BASE_URL + "/me/change-password";

}

export function computePaginationPartFromFetchURL(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, hasQuestionMark?:boolean) {
    let url: string = hasQuestionMark ? '?' : '';
    if (pageNo !== undefined) {
        url += 'pageNo=' + pageNo;
    }
    if (pageSize) {
        url += '&pageSize=' + pageSize;
    }
    if (sortBy) {
        url += '&sortBy=' + sortBy;
    }
    if (sortDir) {
        url += '&sortDir=' + sortDir;
    }
    return url;
}

export function computeSearchURLWithPagination(searchText: string, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string) {
    const searchTextTrimmed = searchText.trim();
    let url: string = '/search?keyword=' + searchTextTrimmed + '&' + computePaginationPartFromFetchURL(pageNo, pageSize, sortBy, sortDir);  
    return url;
}

export function computeURLWithId(rootURL: string, id: number) {
    return rootURL + '/' + id;
}

export function computeFetchURL(api_root: string, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string) {
    let url = api_root;
    if (searchText) {
        const trimmedText = searchText.trim();
        url += computeSearchURLWithPagination(trimmedText, pageNo, pageSize, sortBy, sortDir);
    } else {
        url += computePaginationPartFromFetchURL(pageNo, pageSize, sortBy, sortDir, true);
    }
    return url;
}