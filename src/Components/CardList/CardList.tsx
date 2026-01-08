import react from "react";
import Card from "../Card/Card";

type Props = {};

const CardList = (props: Props) => {
    return (
        <div>
            <Card projectTitle="Kayla Bot" projectDescription="A discordbot i coded using python" projectLink="https://github.com/Destroyers04/KaylaBot" />
            <Card projectTitle="Machine Learning Project" projectDescription="In this collaborative group project we worked with a complex dataset where we defined the prediction objectives and analysis approach ourselves." projectLink="https://github.com/Destroyers04/Info284_Project" />
            <Card projectTitle="Portfolio Website" projectDescription="a fully functional portfolio website, using Vue.js and Tailwind CSS. The project began with a design phase in Figma where I created the initial mockups and UI components before implementing them with code." projectLink="https://github.com/Destroyers04/AARON-MALE" />
        </div>
    );
};

export default CardList;