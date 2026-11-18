import "./Login.css";

export default function Login() {
    const googleLogin = () => {
        window.location.assign("http://localhost:8000/google_auth/login");
    };

    return (
        <div>
            <button onClick={googleLogin}>Login with Google</button>
        </div>
    );
}