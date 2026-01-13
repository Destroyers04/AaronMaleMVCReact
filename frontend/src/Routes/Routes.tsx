import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AboutPage from "../Pages/AboutPage";
import HomePage from "../Pages/HomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> }, 
            { path: "about", element: <AboutPage /> }, 
        ]

    }
]); 