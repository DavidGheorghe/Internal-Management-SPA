import { Role } from '@/Types/Role';

export interface UserStoreState {
    currentUserId: number | null,
    currentUserUsername: string | null,
    currentUserRoles: Role[],
    isLoggedIn: boolean
}