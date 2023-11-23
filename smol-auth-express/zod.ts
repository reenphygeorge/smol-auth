import { object, string } from 'zod';

const signUpOrSignInObject = object({
    email: string(),
    password: string()
})

const roleObject = object({
    role: string()
})

export { signUpOrSignInObject, roleObject }