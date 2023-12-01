import { GetAuthId } from "./types";

export const getAuthId: GetAuthId = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('smolAuthId');
    }
}