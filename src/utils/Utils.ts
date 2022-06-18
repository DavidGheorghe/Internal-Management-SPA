import axios from 'axios';

export enum SizeType {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

export class APIUrls {
    static readonly BASE_URL = "http://localhost:8080/api";
    static readonly API_LOGIN_URL = APIUrls.BASE_URL + "/auth/login/";
    static readonly API_REFRESH_TOKEN = APIUrls.BASE_URL + "/auth/refresh-token";
    static readonly API_PRODUCT_ROOT = APIUrls.BASE_URL + "/products";
    static readonly API_PRODUCT_CATEGORY = APIUrls.BASE_URL + "/product-categories";
}

const requestHeaders = {
    "Content-Type" : "application/json",
    "Authorization" : getLocalAccessToken()
}

export function getLocalAccessToken() {
    return localStorage.getItem("accessToken");
}

export function getLocalRefreshToken() {
    return localStorage.getItem("refreshToken");
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
                    const { accessToken } = rs.headers["refresh-token"]; // get token from header!!!
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

async function getRefreshToken() {
    return await axios({
        url: APIUrls.API_REFRESH_TOKEN,
        headers: {
            "Authorization": getLocalRefreshToken()
        }
    });
}

