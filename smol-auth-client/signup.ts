import { __apiDomain } from "./index";
import { SignUp } from "./types";

export const signup: SignUp = async (email: string, password: string) => {
    try {
        const response = await fetch(`http://${__apiDomain}/signup`, {
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