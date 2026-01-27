import Card from "./Card";
import PythonLogo from "../assets/img/PythonLogo.svg";
import TypescriptLogo from "../assets/img/typescript-logo.svg";
import ReactLogo from "../assets/img/react-logo.svg";
import TailwindLogo from "../assets/img/tailwind-logo.svg";
import VueLogo from "../assets/img/vue-logo.svg";

function CardList() {
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