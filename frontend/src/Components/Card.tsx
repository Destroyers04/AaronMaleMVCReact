interface Props {
    technologyName : string;
    technologyLogo : string;
}

function Card({ technologyName, technologyLogo }: Props) {
    return (
        <div className="bg-[#BDE8F5] flex flex-col px-2 py-1 rounded-sm shadow-lg animate-pulse">
            <img
                className="h-5 w-auto flex-shrink-0"
                src={technologyLogo}
                alt={`${technologyName} logo`}
            />
            <h1 className="font-title font-medium text-xs text-center">
                {technologyName}
            </h1>
        </div>
    );
}


export default Card;