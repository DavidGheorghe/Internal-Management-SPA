import { OrderStatus } from '@/types/OrderTypes';
import { Role } from '@/types/Role';
import { EntityData } from '@/types/UtilsTypes';
import axios, { AxiosResponse } from 'axios';
import { reactive } from 'vue';
import { APIUrls } from './APIURLs';
import { getRefreshToken } from './JWTUtils';

export enum SizeType {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

export const axiosInstance = axios.create({
    baseURL: APIUrls.BASE_URL,
    withCredentials: true
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
                    return await axiosInstance(originalConfig);
                } catch (_error: any) {
                    if (_error.response && _error.response.data) {
                        return Promise.reject(_error.response.data);
                    }
                    return await Promise.reject(_error);
                }
            }
            if (err.response.status === 403 && err.response.data) {
                return await Promise.reject(err.response.data);
            }
        }
        return await Promise.reject(err);
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
    OrderStatus[OrderStatus.COMPLETE],
]

export function isStatusBefore(currentStatus: OrderStatus, status: OrderStatus) {
    const comparisonResult = compareStatuses(currentStatus, status);
    let isBefore: boolean = false;
    if (comparisonResult === 1) {
        isBefore = true;
    }
    return isBefore;
}

export function compareStatuses(firstStatus: OrderStatus, secondStatus: OrderStatus) {
    if (firstStatus < secondStatus) {
        return -1;
    } else if (firstStatus > secondStatus) {
        return 1;
    }
    return 0;
}

export const lastEightWeeksDatesStr = {
    eightWeeksAgo: computeDateStringForWeeksAgo(8, 7),
    sevenWeeksAgo: computeDateStringForWeeksAgo(7, 6),
    sixWeeksAgo: computeDateStringForWeeksAgo(6, 5),
    fiveWeeksAgo: computeDateStringForWeeksAgo(5, 4),
    fourWeeksAgo: computeDateStringForWeeksAgo(4, 3),
    threeWeeksAgo: computeDateStringForWeeksAgo(3, 2),
    twoWeeksAgo: computeDateStringForWeeksAgo(2, 1),
    oneWeeksAgo: computeDateStringForWeeksAgo(1, 0),
}

function computeDateStringForWeeksAgo(week1: number, week2: number) {
    const week1Date = substractDays(week1 * 7);
    const week2Date = substractDays(week2 * 7 + 1);
    const week1Str = week1Date.toLocaleDateString("ro-RO", {month: 'numeric', day: 'numeric'});
    const week2Str = week2Date.toLocaleDateString("ro-RO", {month: 'numeric', day: 'numeric'});
    return week1Str + " - " + week2Str;
}

function substractDays(numberOfDays: number) {
    return new Date(new Date().setDate(new Date().getDate() - numberOfDays));
}

export const rolesAsStr: string[] = [
    Role[Role.EMPLOYEE],
    Role[Role.SUPERVISOR],
    Role[Role.ADMIN]
]

export const roles: Role[] = [
    Role.EMPLOYEE,
    Role.SUPERVISOR,
    Role.ADMIN
]

export function getIdsFromRoles(roles: Role[]) {
    const ids: number[] = [];
    for (let i = 0; i < roles.length; i++) {
        ids.push(Number.parseInt(Role[roles[i]]));
    }
    return ids;
}

