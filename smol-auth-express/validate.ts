import { RoleDataResponse, UserDataResponse } from "./types"

const signUpOrSignInObject = (data: any): UserDataResponse => {
    if (typeof data !== 'object' || data === null)
        return {
            success: false,
        }
    if (
        typeof data.email === 'string' &&
        typeof data.password === 'string'
    )
        return {
            success: true,
            data: {
                email: data.email,
                password: data.password
            }
        }
    else
        return {
            success: false,
        }
}

const roleObject = (data: any): RoleDataResponse => {
    if (typeof data !== 'object' || data === null)
        return {
            success: false,
        }
    if (
        typeof data.email === 'string' &&
        typeof data.password === 'string'
    )
        return {
            success: true,
            data: {
                role: data.role,
            }
        }
    else
        return {
            success: false,
        }
}

export { signUpOrSignInObject, roleObject }