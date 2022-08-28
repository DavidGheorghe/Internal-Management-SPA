import router from "@/router";
import { Role } from '@/types/Role';
import { APIUrls } from "@/utils/APIURLs";
import { formatJWT, getRolesAsStrFromToken, getUsernameFromToken } from "@/utils/JWTUtils";
import axios from 'axios';
import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { UserStoreState } from "./UserStoreStateI";

export const useUserStore = defineStore('user', {
    state: (): UserStoreState => ({
        currentUserId: -1,
        currentUserUsername: "",
        currentUserRoles: [],
        isLoggedIn: false,
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
            await axios({
                method: 'post',
                url: APIUrls.API_LOGIN_URL,
                data: authDTO,
                withCredentials: true
            });
            const { cookies } = useCookies();
            /** Set current user credentials. */
            const accessToken = cookies.get('access-token');
            if (accessToken) {
                const formattedToken = formatJWT(accessToken);
                const usernameFromToken = getUsernameFromToken(formattedToken);
                const rolesFromToken = getRolesAsStrFromToken(formattedToken);
                this.currentUserUsername = usernameFromToken;
                this.currentUserRoles = rolesFromToken;
                this.isLoggedIn = true;
            }
        },
        logOut() {
            this.$reset();
            router.push("/login");
            const { cookies } = useCookies();
            cookies.remove('access-token');
        }
    },
    persist: true
});