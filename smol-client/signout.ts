export const signout = async () => {
    try {
        const response = await fetch('http://localhost:8000/signout', {
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