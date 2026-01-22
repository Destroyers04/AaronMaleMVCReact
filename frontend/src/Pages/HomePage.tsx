import React from "react";
import Hero from "../Components/Hero";
import Bio from "../Components/Bio";

interface Props { }

function HomePage(props: Props) {
    return (
        <div>
            <Hero />
            <Bio />
        </div>
    );
};

export default HomePage;