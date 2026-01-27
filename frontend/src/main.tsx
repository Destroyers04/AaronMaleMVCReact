import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./Routes/Routes";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);