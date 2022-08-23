import { Role } from "./Role"

export type ChangePasswordDTO = {
    oldPassword: string,
    newPassword: string
}

export type User = {
    id: number,
    username: string,
    roles: Role[]
}

export type CreateUserDTO = {
    username: string,
    rolesIds: number[]
}