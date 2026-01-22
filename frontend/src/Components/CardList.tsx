import react from "react";
import Card from "./Card";
import PythonLogo from "../Assets/img/PythonLogo.svg";
import TypescriptLogo from "../Assets/img/typescript-logo.svg";
import ReactLogo from "../Assets/img/react-logo.svg";
import TailwindLogo from "../Assets/img/tailwind-logo.svg";
import VueLogo from "../Assets/img/vue-logo.svg";

type Props = {};

function CardList (props: Props) {
    return (
        <div className="flex flex-wrap gap-3 m-2">
            <Card technologyName="Python" technologyLogo={PythonLogo}/>
            <Card technologyName="Typescript" technologyLogo={TypescriptLogo}/>
            <Card technologyName="React" technologyLogo={ReactLogo} />
            <Card technologyName="Tailwind" technologyLogo={TailwindLogo}/>
            <Card technologyName="Vue" technologyLogo={VueLogo} />
        </div>
    );
};

export default CardList;