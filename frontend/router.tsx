import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./src/login/Login";
import HomePage from "./src/HomePage";
import ProjectsPage from "./src/projects/Projects";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/projects",
    element: <ProjectsPage />
  }
]);
