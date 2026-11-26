import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const API_URL = "http://localhost:8000";

type User = {
    id: string;
    email: string;
    name: string;
    google_id: string | null;
};

function UserMenu({
    user,
    onLogout,
    onStart,
}: {
    user: User;
    onLogout: () => void;
    onStart: () => void;
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

    // Close the dropdown on outside click or Escape
    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div className="user-menu" ref={menuRef}>
            <button className="start-btn" onClick={onStart}>
                Start designing
            </button>
            <button
                className="user-avatar"
                aria-label={`Account menu for ${user.name}`}
                aria-haspopup="menu"
                aria-expanded={open}
                title={user.email}
                onClick={() => setOpen((o) => !o)}
            >
                {initial}
            </button>
            {open && (
                <div className="user-dropdown" role="menu">
                    <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                    </div>
                    <button className="user-logout" role="menuitem" onClick={onLogout}>
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

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

    return (
        <div className="home-page">
            {loading ? null : user ? (
                // TODO: point this at the designer/projects page once that route exists
                <UserMenu user={user} onLogout={logout} onStart={() => navigate("/")} />
            ) : (
                <button className="login-btn" onClick={() => navigate("/login")}>
                    Login
                </button>
            )}
        </div>
    );
}
