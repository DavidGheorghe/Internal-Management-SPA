import { OrderStatus } from '@/types/OrderTypes';
import { EntityData } from '@/types/UtilsTypes';
import axios, { AxiosResponse } from 'axios';
import { APIUrls } from './APIURLs';
import { getLocalAccessToken, getRefreshToken } from './JWTUtils';

export enum SizeType {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

const requestHeaders = {
    "Content-Type" : "application/json",
    "Authorization" : getLocalAccessToken()
}

export const axiosInstance = axios.create({
    baseURL: APIUrls.BASE_URL,
    headers: requestHeaders
});

axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const rs = await getRefreshToken();
                    const accessToken  = rs.headers["refresh-token"];
                    localStorage.setItem("accessToken", accessToken);
                    return axiosInstance(originalConfig);
                } catch (_error: any) {
                    if (_error.response && _error.response.data) {
                        return Promise.reject(_error.response.data);
                    }
                    return Promise.reject(_error);
                }
            }
            if (err.response.status === 403 && err.response.data) {
                return Promise.reject(err.response.data);
            }
        }
        return Promise.reject(err);
    }
)


export function createEntityDataFromResponse<T> (response: AxiosResponse<any>) {
    const productData = {} as EntityData<T>;
    productData.content = response.data.content;
    productData.last = response.data.last;
    productData.pageNo = response.data.pageNo;
    productData.pageSize = response.data.pageSize;
    productData.totalPages = response.data.totalPages;
    productData.totalElements = response.data.totalElements;
    return productData;
}

export const statusesAsStrings: string[] = [ 
    OrderStatus[OrderStatus.NEW],
    OrderStatus[OrderStatus.POURING],
    OrderStatus[OrderStatus.DRYING],
    OrderStatus[OrderStatus.SANDING],
    OrderStatus[OrderStatus.SEALING],
    OrderStatus[OrderStatus.PACKING],
    OrderStatus[OrderStatus.READY],
]