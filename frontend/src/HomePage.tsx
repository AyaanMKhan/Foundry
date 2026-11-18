import React from "react";
import LoginPage from "./login/Login";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";




export default function HomePage(){

    const navigate = useNavigate();

    const LoginNavigate = () => {
        navigate(`/login`)
    }
    
    return (
        <div className="home-page">
            <button onClick={LoginNavigate}>Login</button>
        </div>
    );
}