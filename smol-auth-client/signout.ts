import { __apiDomain } from ".";

export const signout = async () => {
    try {
        const response = await fetch(`http://${__apiDomain}/signout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();
        return data
    }
    catch (error: any) {
        console.error('Error:', error.message);
    }
}