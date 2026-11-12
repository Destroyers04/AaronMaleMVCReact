import { Link, Outlet } from "react-router-dom";
import AMLogoBlue from "@/assets/img/am-logo-blue.svg";

// Own layout for the bingo pages: no site NavBar/Footer, shadcn theme scoped by .bingo-theme
function BingoLayout() {
    return (
        <div className="bingo-theme relative min-h-dvh bg-background font-body text-foreground">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,#BDE8F5_0%,transparent_70%)]" />

            <header className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
                <Link to="/" className="flex items-center gap-2 underline-effect">
                    <img src={AMLogoBlue} className="h-7 -translate-y-0.5" alt="Aaron Male Logo" />
                    <span className="font-title text-lg font-semibold">Home</span>
                </Link>
                {/* multiply blends away the banner's white background on the blue page */}
                <img src="/bingo/Worlds_2026_Banner.webp" alt="Worlds 2026" className="h-6 w-auto mix-blend-multiply sm:h-8" />
            </header>

            <main className="relative mx-auto w-full max-w-5xl px-4 pb-16 sm:px-8">
                <Outlet />
            </main>
        </div>
    );
}

export default BingoLayout;
