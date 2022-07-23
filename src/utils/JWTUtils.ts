import axios from "axios";
import { APIUrls } from "@/utils/APIURLs";
import jwt_decode from "jwt-decode";
import { useUserStore } from "@/stores/UserStore";
import { axiosInstance } from "./Utils";

export interface JWTExpiration {
    // name: string,
    exp: number,

}

export function getJWTExpiryDateInMills(): number | undefined {
    const jwt = getLocalAccessToken();
    if (jwt) {
        const decodedJwt = jwt_decode<JWTExpiration>(jwt);
        return decodedJwt['exp'];
    }
    return undefined;
}

export function getLocalAccessToken(): string {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ?? ""; // workaround until the tokens are set in cookies
}

export function getLocalRefreshToken(): string {
    const refreshToken =  localStorage.getItem("refreshToken");
    return refreshToken ?? ""; // workaround until the tokens are set in cookies
}

export async function getRefreshToken() {
    // return await axiosInstance({
    //     method: 'get',
    //     url: APIUrls.API_REFRESH_TOKEN
    // })
    return await axios({
        url: APIUrls.API_REFRESH_TOKEN,
        headers: {
            "Authorization": getLocalRefreshToken()
        }
    });
}

export function logoutAfterJWTExpiration() {
    const userStore = useUserStore();
    const jwtExpirationInMills = getJWTExpiryDateInMills();
    if (jwtExpirationInMills) {
        const currentTimeInMills = new Date().getTime() / 1000;
        const expirationTimeInMills = (jwtExpirationInMills - currentTimeInMills) * 1000; // multiply with 1000 in order to convert the time in seconds.
        setTimeout(() => {
            userStore.logOut();
        }, expirationTimeInMills);
    }
    
}