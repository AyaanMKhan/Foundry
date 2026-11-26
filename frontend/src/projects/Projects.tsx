import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { API_URL, logoutRequest, type User } from "../api";
import "./Projects.css";

type Project = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    blueprint: { nodes?: unknown[]; edges?: unknown[] } | null;
};

function plural(n: number, word: string) {
    return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function ProjectCard({ project }: { project: Project }) {
    const nodes = project.blueprint?.nodes?.length ?? 0;
    const edges = project.blueprint?.edges?.length ?? 0;
    return (
        <article className="project-card">
            <div className="project-card-preview" aria-hidden="true" />
            <div className="project-card-body">
                <h2 className="project-card-title">{project.title}</h2>
                <p className="project-card-desc">
                    {project.description || <span className="muted">No description</span>}
                </p>
                <div className="project-card-meta">
                    {plural(nodes, "component")} · {plural(edges, "connection")}
                </div>
            </div>
        </article>
    );
}

function NewProjectDialog({
    open,
    onClose,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    onCreated: (p: Project) => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        if (open && !d.open) {
            setTitle("");
            setDescription("");
            setError(null);
            d.showModal();
        } else if (!open && d.open) {
            d.close();
        }
    }, [open]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/project/create`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: trimmed,
                    description: description.trim() || null,
                }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof data?.detail === "string" ? data.detail : "Couldn't create project.");
                return;
            }
            onCreated(data as Project);
        } catch {
            setError("Couldn't reach the server.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="new-project-dialog"
            onClose={onClose}
            onClick={(e) => {
                // Clicking the backdrop (the dialog element itself) closes it
                if (e.target === dialogRef.current) onClose();
            }}
        >
            <form onSubmit={submit}>
                <h2>New project</h2>
                <label>
                    <span>Title</span>
                    <input
                        autoFocus
                        required
                        maxLength={50}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. URL shortener"
                    />
                </label>
                <label>
                    <span>
                        Description <span className="muted">(optional)</span>
                    </span>
                    <textarea
                        rows={3}
                        maxLength={255}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What system are you designing?"
                    />
                </label>
                {error && (
                    <p className="form-error" role="alert">
                        {error}
                    </p>
                )}
                <div className="dialog-actions">
                    <button type="button" className="btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={submitting || !title.trim()}>
                        {submitting ? "Creating…" : "Create project"}
                    </button>
                </div>
            </form>
        </dialog>
    );
}

export default function ProjectsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const meRes = await fetch(`${API_URL}/google_auth/me`, { credentials: "include" });
                if (meRes.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }
                if (!meRes.ok) throw new Error();
                const me: User = await meRes.json();
                const projRes = await fetch(`${API_URL}/project/mine`, { credentials: "include" });
                if (!projRes.ok) throw new Error();
                const list: Project[] = await projRes.json();
                if (!cancelled) {
                    setUser(me);
                    setProjects(list);
                }
            } catch {
                if (!cancelled) setError("Couldn't load your projects. Is the server running?");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [navigate]);

    const logout = async () => {
        await logoutRequest();
        navigate("/");
    };

    return (
        <div className="projects-page">
            <header className="projects-nav">
                <Link to="/" className="projects-logo">
                    Foundry
                </Link>
                {user && <UserMenu user={user} onLogout={logout} />}
            </header>

            <main className="projects-main">
                <div className="projects-head">
                    <div>
                        <h1>Projects</h1>
                        <p className="muted">Your system designs.</p>
                    </div>
                    {projects && projects.length > 0 && (
                        <button className="btn-primary" onClick={() => setDialogOpen(true)}>
                            + New project
                        </button>
                    )}
                </div>

                {error ? (
                    <p className="form-error">{error}</p>
                ) : projects === null ? (
                    <p className="muted">Loading…</p>
                ) : projects.length === 0 ? (
                    <div className="projects-empty">
                        <h2>No projects yet</h2>
                        <p className="muted">Create your first system design to get started.</p>
                        <button className="btn-primary" onClick={() => setDialogOpen(true)}>
                            + New project
                        </button>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </main>

            <NewProjectDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onCreated={(p) => {
                    setProjects((prev) => [p, ...(prev ?? [])]);
                    setDialogOpen(false);
                }}
            />
        </div>
    );
}
