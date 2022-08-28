import axios from "axios";
import { APIUrls } from "@/utils/APIURLs";
import jwt_decode from "jwt-decode";
import { useUserStore } from "@/stores/UserStore";
import { axiosInstance } from "./Utils";
import { Role } from "@/types/Role";
import { computeStatusFromString } from "./OrderServiceUtils";

export interface JWTExpiration {
    // name: string,
    exp: number,

}

export interface JWTDecoded {
    username: string,
    exp: number,
    roles: string[]
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

export function formatJWT(token: string): string {
    const formattedToken = token ; //token.substring(7);
    return formattedToken;
}

export function getUsernameFromToken(token: string): string {
    const decodedJwt = jwt_decode<JWTDecoded>(token);
    return decodedJwt['username'];
}

export function getRolesFromToken(token: string): Role[] {
    const roles: Role[] = [];
    const decodedJwt = jwt_decode<JWTDecoded>(token);
    const rolesStr = decodedJwt['roles'];
    rolesStr.forEach(roleStr => {
        const roleStrFormatted = roleStr.substring(5);
        const role = computeStatusFromString(roleStrFormatted);
        if (role) {
            roles.push(role);
        }
    })
    return roles;
}

export function getRolesAsStrFromToken(token: string): string[] {
    const roles: string[] = [];
    const decodedJwt = jwt_decode<JWTDecoded>(token);
    const rolesStr = decodedJwt['roles'];
    rolesStr.forEach(roleStr => {
        const roleStrFormatted = roleStr.substring(5); // Remove 'ROLE_'
        roles.push(roleStrFormatted);
    })
    return roles;
}