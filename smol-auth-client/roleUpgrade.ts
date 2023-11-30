import { __apiDomain } from "./index";
import { RoleUpgrade } from "./types";

export const roleUpgrade: RoleUpgrade = async (role: string) => {
    try {
        const response = await fetch(`http://${__apiDomain}/updateRole`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role }),
            credentials: 'include'
        });

        const data = await response.json();
        return data
    }
    catch (error: any) {
        console.error('Error:', error.message);
    }
}