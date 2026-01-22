import { Outlet } from 'react-router';
import './App.css';
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";


function App() {
    return (
        <div className="App flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default App;
