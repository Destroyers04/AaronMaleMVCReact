import React from "react";

interface Props {
    projectTitle : string;
    projectDescription : string;
    projectLink : string;
}

function Card({ projectTitle, projectDescription, projectLink }: Props) {
    return (
        <div className="card">
            <h1>{projectTitle}</h1>
            <img src={"./assets/img/am-logo-white.svg"} alt={projectTitle} />
            <p>{projectDescription}</p>
            <a>{projectLink}</a>
        </div>

    );
}

export default Card;