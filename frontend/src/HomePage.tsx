import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const API_URL = "http://localhost:8000";

type User = {
    id: string;
    email: string;
    name: string;
    google_id: string | null;
};

export default function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/google_auth/me`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const logout = async () => {
        await fetch(`${API_URL}/google_auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    if (loading) return null;

    return (
        <div className="home-page">
            {user ? (
                <>
                    <span>Hi, {user.name}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <button onClick={() => navigate("/login")}>Login</button>
            )}
        </div>
    );
}
