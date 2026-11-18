import React from "react";
import LoginPage from "./login/Login";
import { useNavigate } from "react-router-dom";




export default function HomePage(){

    const navigate = useNavigate();

    const LoginNavigate = () => {
        navigate(`/login`)
    }
    
    return (
        <div>
            <button onClick={LoginNavigate}>Login</button>
        </div>
    );
}