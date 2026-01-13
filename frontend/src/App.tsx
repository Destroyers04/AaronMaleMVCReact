import { Outlet } from 'react-router';
import './App.css';
import NavBar from "./Components/NavBar";


function App() {
    return (
        
        <div className="App">
            <NavBar />
            <Outlet />
        </div>
    )
}

export default App;
