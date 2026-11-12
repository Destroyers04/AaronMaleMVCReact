import { createBrowserRouter, redirect } from "react-router-dom";
import App from "../App";
import AboutPage from "../Pages/AboutPage";
import HomePage from "../Pages/HomePage";
import BingoLayout from "../Pages/Bingo/BingoLayout";
import BingoLogin from "../Pages/Bingo/BingoLogin";
import BingoSetup from "../Pages/Bingo/BingoSetup";
import BingoCard from "../Pages/Bingo/BingoCard";
import BingoError from "../Pages/Bingo/BingoError";
import { loadMe } from "../bingo/store";

// Sends bingo players to the right page depending on login and whether they already have a card.
// Returns { player, board } for the page. Network errors show BingoError.
const bingoGuard = (page: "setup" | "card") => async () => {
    const me = await loadMe();
    if (!me) return redirect("/worlds2026bingo");
    if (page === "setup" && me.board) return redirect("/worlds2026bingo/card");
    if (page === "card" && !me.board) return redirect("/worlds2026bingo/setup");
    return me;
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "about", element: <AboutPage /> },
        ]

    },
    {
        // Outside App so it gets its own layout without NavBar/Footer
        path: "/worlds2026bingo",
        element: <BingoLayout />,
        children: [
            { index: true, element: <BingoLogin /> },
            { path: "setup", element: <BingoSetup />, loader: bingoGuard("setup"), errorElement: <BingoError /> },
            { path: "card", element: <BingoCard />, loader: bingoGuard("card"), errorElement: <BingoError /> },
        ]
    }
]);