import { useUserStore } from "@/stores/UserStore";
import { Role } from "@/types/Role";

export function useIsCurrentUserAdmin(): boolean {
    const userStore = useUserStore();
    const isAdmin = userStore.hasRole(Role.ADMIN);
    return isAdmin;
}

export function useIsCurrentUserEmployee(): boolean {
    const userStore = useUserStore();
    const isEmployee = userStore.hasRole(Role.EMPLOYEE);
    return isEmployee;
}

export function useIsCurrentUserSupervisor(): boolean {
    const userStore = useUserStore();
    const isSupervisor = userStore.hasRole(Role.SUPERVISOR);
    return isSupervisor;
}

