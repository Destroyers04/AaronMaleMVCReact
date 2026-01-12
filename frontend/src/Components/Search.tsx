import React, { useState, type ChangeEvent, type MouseEvent } from "react";

interface Props { }

function Search(props: Props) {
    // Variable to hold the search input
    const [search, setSearch] = useState<string>("");

    // Function to handle input changes
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        console.log(event);
    };

    const onClick = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(event);
    };

    return (
        <div>
            <input value={search} onChange={(event) => handleChange(event)}></input>
            <button onClick={(event) => onClick(event)}>Search</button>
        </div>
    )
};

export default Search;