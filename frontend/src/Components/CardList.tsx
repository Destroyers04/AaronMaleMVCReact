import react from "react";
import Card from "./Card";
import PythonLogo from "../Assets/img/PythonLogo.svg";
import TypescriptLogo from "../Assets/img/typescript-logo.svg";
import ReactLogo from "../Assets/img/react-logo.svg";
import TailwindLogo from "../Assets/img/tailwind-logo.svg";
import VueLogo from "../Assets/img/vue-logo.svg";
import PandasLogo from "../Assets/img/pandas-logo.svg";

type Props = {};

function CardList (props: Props) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card technologyName="Python" technologyLogo={PythonLogo} color="#E8B756" />
            <Card technologyName="TS" technologyLogo={TypescriptLogo} color="#9B9BD5" />
            <Card technologyName="React" technologyLogo={ReactLogo} color="#D97BA3" />
            <Card technologyName="Tailwind" technologyLogo={TailwindLogo} color="#4DB8D9" />
            <Card technologyName="Vue" technologyLogo={VueLogo} color="#6FBB7F" />
            <Card technologyName="Pandas" technologyLogo={PandasLogo} color="#9B7FBE" />
        </div>
    );
};

export default CardList;