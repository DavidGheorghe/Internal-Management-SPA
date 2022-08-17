import { useUserStore } from "@/stores/UserStore"
import { ChangePasswordDTO } from "@/types/UserTypes";
import { APIUrls } from "@/utils/APIURLs";
import { axiosInstance } from "@/utils/Utils";

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