import { Outlet } from 'react-router';
import './App.css';
import CardList from "./Components/CardList";
import Search from './Components/Search';
import { useState, type ChangeEvent, type MouseEvent } from 'react';


function App() {
    // Variable to hold the search input
    const [search, setSearch] = useState<string>("");

    // handle input changes
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        console.log(event);
    };

    // handle button click
    const onClick = (event: MouseEvent<HTMLButtonElement>) => {
        console.log(event);
    };
    return (
        
        <div className="App">
            <Search onClick={onClick} search={search} handleChange={handleChange} />
            <CardList /> 
            <Outlet />
        </div>
    );
}

export default App
