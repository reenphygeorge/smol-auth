import { __apiDomain } from ".";

export const signin = async (email: string, password: string) => {
    try {
        const response = await fetch(`http://${__apiDomain}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();
        return data
    }
    catch (error: any) {
        console.error('Error:', error.message);
    }
}