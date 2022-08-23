import { useUserStore } from "@/stores/UserStore"
import { ChangePasswordDTO, CreateUserDTO, User } from "@/types/UserTypes";
import { APIUrls } from "@/utils/APIURLs";
import { axiosInstance } from "@/utils/Utils";
import axios, { AxiosResponse } from "axios";

export async function changePassword(oldPassword: string, newPassword: string) {
    const userStore = useUserStore();
    const url = APIUrls.API_CHANGE_PASSWORD + "/" + userStore.getCurrentUserId;
    const changePasswordDTO: ChangePasswordDTO = {
        oldPassword,
        newPassword
    } 
    await axiosInstance({
        method: 'put',
        data: changePasswordDTO,
        url: url
    });
}

export async function fetchUsers() {
    const url = APIUrls.API_USERS_ROOT + "/all";
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedUsers = createUsersListFromResponse(response);
    return fetchedUsers;
}

export async function fetchEmployees() {
    const url = APIUrls.API_USERS_ROOT + "/employees";
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedUsers = createUsersListFromResponse(response);
    return fetchedUsers;
}

export async function deleteUserById(id: number) {
    const url = APIUrls.API_USERS_ROOT + "/" + id;
    await axiosInstance({
        method: 'delete',
        url: url
    });
}

export async function createUser(newUser: CreateUserDTO) {
    const url = APIUrls.API_USERS_ROOT;
    await axiosInstance({
        method: 'post',
        url: url,
        data: newUser
    })
}

function createUsersListFromResponse(response: AxiosResponse<any>) {
    const users: User[] = [];
    for (let i = 0; i < response.data.length; i++) {
        const fetchedUser = response.data[i];
        const user: User = {
            id: fetchedUser.id,
            username: fetchedUser.username,
            roles: fetchedUser.roles
        }
        users.push(user);
    }
    return users;
}