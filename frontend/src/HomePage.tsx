import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "./components/UserMenu";
import { API_URL, logoutRequest, type User } from "./api";
import "./HomePage.css";

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
        await logoutRequest();
        setUser(null);
    };

    return (
        <div className="home-page">
            {loading ? null : user ? (
                <UserMenu user={user} onLogout={logout} onStart={() => navigate("/projects")} />
            ) : (
                <button className="login-btn" onClick={() => navigate("/login")}>
                    Login
                </button>
            )}
        </div>
    );
}
