import Hero from "../Components/Hero";
import Bio from "../Components/Bio";
import GithubActivity from "../Components/GithubActivity";

function HomePage() {
    return (
        <div>
            <Hero />
            <Bio />
            <GithubActivity/>
        </div>
    );
};

export default HomePage;