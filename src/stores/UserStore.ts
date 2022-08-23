import router from "@/router";
import axios from 'axios';
import { defineStore } from "pinia";
import { APIUrls } from "@/utils/APIURLs";
import { UserStoreState } from "./UserStoreStateI";
import { Role } from '@/types/Role';
import { logoutAfterJWTExpiration } from "@/utils/JWTUtils";


export const useUserStore = defineStore('user', {
    state: (): UserStoreState => ({
        currentUserId: -1,
        currentUserUsername: "",
        currentUserRoles: [],
        isLoggedIn: false
    }),
    getters: {
        getCurrentUserId: (state) => state.currentUserId,
        getCurrentUsername: (state) => state.currentUserUsername,
        getCurrentUserRoles: (state) => state.currentUserRoles,
        isUserLoggedIn: (state) => state.isLoggedIn,
        hasRole: (state) => { return (role: Role) => state.currentUserRoles.includes(Role[role]); } 
    },
    actions: {
        async logIn(username: string, password: string) {
            const authDTO = {
                "username" : username,
                "password" : password
            }
            const loginResponse = await axios({
                method: 'post',
                url: APIUrls.API_LOGIN_URL,
                data: authDTO
            });
            /** Set JWT tokens in LocalStorage. */
            const accessToken = loginResponse.headers["access-token"];
            const refreshToken = loginResponse.headers["refresh-token"];
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            /** Set current user credentials. */
            this.currentUserId = loginResponse.data.id;
            this.currentUserUsername = loginResponse.data.username;
            this.currentUserRoles = loginResponse.data.roles;
            this.isLoggedIn = true;
            /** Go to Home page. */
            router.push("/");
            // logoutAfterJWTExpiration();
            // return await axios({
            //     method: 'post',
            //     url: APIUrls.API_LOGIN_URL,
            //     data: authDTO
            // }).then((loginResponse) => {
            //     /** Set JWT tokens in LocalStorage. */
            //     const accessToken = loginResponse.headers["access-token"];
            //     const refreshToken = loginResponse.headers["refresh-token"];
            //     localStorage.setItem("accessToken", accessToken);
            //     localStorage.setItem("refreshToken", refreshToken);
            //     /** Set current user credentials. */
            //     this.currentUserId = loginResponse.data.id;
            //     this.currentUserUsername = loginResponse.data.username;
            //     this.currentUserRoles = loginResponse.data.roles;
            //     this.isLoggedIn = true;
            //     /** Go to Home page. */
            //     router.push("/");
            //     logoutAfterJWTExpiration();
            // })
        },
        logOut() {
            this.$reset();
            router.push("/login");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    },
    persist: true
});