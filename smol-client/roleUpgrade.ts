export const roleUpgrade = async (role: string) => {
    try {
        const response = await fetch('http://localhost:8000/updateRole', {
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