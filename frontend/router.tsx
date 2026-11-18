import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./src/login/Login";
import HomePage from "./src/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />
  }
]);