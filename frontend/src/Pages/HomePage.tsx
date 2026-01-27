import React from "react";
import Hero from "../Components/Hero";
import Bio from "../Components/Bio";
import GithubActivity from "../Components/GithubActivity";

interface Props { }

function HomePage(props: Props) {
    return (
        <div>
            <Hero />
            <Bio />
            <GithubActivity/>
        </div>
    );
};

export default HomePage;