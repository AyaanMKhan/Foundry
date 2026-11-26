import { useEffect, useRef, useState } from "react";
import type { User } from "../api";
import "./UserMenu.css";

export default function UserMenu({
    user,
    onLogout,
    onStart,
}: {
    user: User;
    onLogout: () => void;
    onStart?: () => void;
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
            {onStart && (
                <button className="start-btn" onClick={onStart}>
                    Start designing
                </button>
            )}
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
