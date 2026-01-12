import { Outlet } from 'react-router';
import './App.css';
import CardList from "./Components/CardList";
import Search from './Components/Search';
function App() {
    return (
        
        <div className="App">
            <Search />
            <CardList /> 
            <Outlet />
        </div>
    );
}

export default App
