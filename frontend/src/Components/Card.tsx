import React from "react";

interface Props {
    technologyName : string;
    technologyLogo : string;
    color : string;
}

function Card({ technologyName, technologyLogo, color }: Props) {
    return (
        <div className="rounded-sm p-2 border-1 border-gray-500 shadow-md" style={{ backgroundColor: color }}>
            <h1 className="font-title font-semibold text-xs flex items-center gap-2">
                <span>
                    <img className="h-15" src={technologyLogo} alt="Icon for technology" />
                </span>
                {technologyName}
            </h1>
        </div>

    );
}

export default Card;