import React, { useState, type ChangeEvent, type MouseEvent } from "react";

interface Props {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    //Searh bar will be empty most of the time
    search: string | undefined;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Search({onClick, search, handleChange}: Props) {
    return (
        <div>
            <input value={search} onChange={(event) => handleChange(event)}></input>
            <button onClick={(event) => onClick(event)}>Search</button>
        </div>
    )
};

export default Search;