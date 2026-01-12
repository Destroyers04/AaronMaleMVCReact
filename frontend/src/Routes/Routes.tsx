import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProjectPage from "../Pages/ProjectPage";
import HomePage from "../Pages/HomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", Element: <HomePage /> }, 
            { path: "project", Element: <ProjectPage /> }, 
        ]

    }
]); 