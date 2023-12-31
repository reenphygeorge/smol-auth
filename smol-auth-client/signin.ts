import { __apiDomain } from "./index";
import { SignIn } from "./types";

export const signin: SignIn = async (email: string, password: string) => {
    try {
        const response = await fetch(`http://${__apiDomain}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success)
            localStorage.setItem('smolAuthId', data.authId)
        return data
    }
    catch (error: any) {
        console.error('Error:', error.message);
    }
}