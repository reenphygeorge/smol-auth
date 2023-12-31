import { __apiDomain } from "./index";
import { SignOut } from "./types";

export const signout: SignOut = async () => {
    try {
        const response = await fetch(`http://${__apiDomain}/api/auth/signout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success)
            localStorage.removeItem('smolAuthId')
        return data
    }
    catch (error: any) {
        console.error('Error:', error.message);
    }
}