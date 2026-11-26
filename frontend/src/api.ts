export const API_URL = "http://localhost:8000";

export type User = {
    id: string;
    email: string;
    name: string;
    google_id: string | null;
};

export async function logoutRequest() {
    await fetch(`${API_URL}/google_auth/logout`, {
        method: "POST",
        credentials: "include",
    });
}
