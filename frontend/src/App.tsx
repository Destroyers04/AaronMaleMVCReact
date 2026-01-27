import { Outlet } from 'react-router';
import './App.css';
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";

function App() {
    return (
        <div className="flex flex-col min-h-screen relative max-w-screen-xl mx-auto">
            <NavBar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
export default App;
